import React, { useState, useMemo } from "react";
import {
  makeStyles,
  tokens,
  Input,
  Dropdown,
  Option,
  Card,
  CardHeader,
  Text,
  Textarea,
  Button,
  Field,
  Tooltip,
  Divider,
} from "@fluentui/react-components";
import type {
  SelectionEvents,
  OptionOnSelectData,
  InputOnChangeData,
  TextareaOnChangeData,
} from "@fluentui/react-components";
import {
  LockClosed24Regular,
  Copy24Regular,
  Mail24Regular,
  CheckmarkCircle24Regular,
  ChevronDown24Regular,
  ChevronUp24Regular,
} from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

import { algorithms, constructMailto } from "../utils/crypto";
import type { AlgorithmType } from "../utils/crypto";
import { useNotify } from "../context/ToastContext";

const useStyles = makeStyles({
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "24px",
    backgroundColor: tokens.colorNeutralBackground2,
    minHeight: "100vh",
  },
  card: {
    width: "100%",
    maxWidth: "550px",
    height: "fit-content",
    boxShadow: tokens.shadow8,
  },
  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "10px",
  },
  gridRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  advancedArea: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    paddingTop: "8px",
    animationName: {
      from: { opacity: 0, height: "0px", transform: "translateY(-10px)" },
      to: { opacity: 1, height: "auto", transform: "translateY(0)" },
    },
    animationDuration: "0.25s",
    animationTimingFunction: "ease-out",
  },
  resultInput: {
    fontFamily: tokens.fontFamilyMonospace,
    color: tokens.colorBrandForeground1,
  },
  toggleButton: {
    width: "100%",
    marginTop: "8px",
    color: tokens.colorNeutralForeground2,
    ":hover": {
      color: tokens.colorBrandForeground1,
      backgroundColor: tokens.colorNeutralBackgroundAlpha,
    },
  },
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Generator: React.FC = () => {
  const styles = useStyles();
  const notify = useNotify();
  const { t } = useTranslation();

  const [algo, setAlgo] = useState<AlgorithmType>("base64");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
  });

  const handleAlgoChange = (_: SelectionEvents, data: OptionOnSelectData) => {
    setAlgo(data.optionValue as AlgorithmType);
  };

  const handleInputChange =
    (field: keyof typeof formData) =>
    (
      _: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      data: InputOnChangeData | TextareaOnChangeData,
    ) => {
      setFormData((prev) => ({ ...prev, [field]: data.value }));
    };

  const isValidEmail = useMemo(() => {
    if (!formData.to) return true;
    return EMAIL_REGEX.test(formData.to);
  }, [formData.to]);

  const generatedUrl = useMemo(() => {
    if (!formData.to || !isValidEmail) return "";

    try {
      let contentToEncrypt = formData.to;

      if (
        isAdvanced ||
        formData.cc ||
        formData.bcc ||
        formData.subject ||
        formData.body
      ) {
        contentToEncrypt = constructMailto(
          formData.to,
          formData.cc,
          formData.bcc,
          formData.subject,
          formData.body,
        );
      }

      const encrypted = algorithms[algo].encrypt(contentToEncrypt);

      const safePayload = encodeURIComponent(encrypted);

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      return `${baseUrl}/${algo}/${safePayload}`;
    } catch (e) {
      return "Error: Encryption Failed";
    }
  }, [formData, algo, isAdvanced, isValidEmail]);

  const copyToClipboard = () => {
    if (generatedUrl && !generatedUrl.startsWith("Error")) {
      navigator.clipboard
        .writeText(generatedUrl)
        .then(() => {
          setCopied(true);
          notify(
            "success",
            t("generator.copiedTitle"),
            t("generator.copiedBody"),
          );
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {
          notify(
            "error",
            t("generator.copyFailedTitle"),
            t("generator.copyFailedBody"),
          );
        });
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <Text weight="bold" size={500}>
              {t("generator.title")}
            </Text>
          }
          description={<Text size={200}>{t("generator.subtitle")}</Text>}
          image={
            <LockClosed24Regular
              style={{ color: tokens.colorBrandForeground1 }}
            />
          }
        />

        <div className={styles.formStack}>
          <Field label={t("generator.algorithm")}>
            <Dropdown
              onOptionSelect={handleAlgoChange}
              value={algorithms[algo].name}
              selectedOptions={[algo]}
            >
              {Object.keys(algorithms).map((key) => (
                <Option
                  key={key}
                  value={key}
                  text={algorithms[key as AlgorithmType].name}
                >
                  {algorithms[key as AlgorithmType].name}
                </Option>
              ))}
            </Dropdown>
          </Field>

          <Field
            label={t("generator.to")}
            required
            validationState={!isValidEmail && formData.to ? "error" : "none"}
            validationMessage={
              !isValidEmail && formData.to ? t("generator.invalidEmail") : null
            }
          >
            <Input
              type="email"
              placeholder={t("generator.toPlaceholder")}
              value={formData.to}
              onChange={handleInputChange("to")}
              contentBefore={<Mail24Regular />}
            />
          </Field>

          <Button
            className={styles.toggleButton}
            appearance="transparent"
            size="small"
            icon={
              isAdvanced ? <ChevronUp24Regular /> : <ChevronDown24Regular />
            }
            onClick={() => setIsAdvanced(!isAdvanced)}
          >
            {isAdvanced
              ? t("generator.hideAdvanced")
              : t("generator.showAdvanced")}
          </Button>

          {isAdvanced && (
            <div className={styles.advancedArea}>
              <Divider />

              <div className={styles.gridRow}>
                <Field label={t("generator.cc")}>
                  <Input
                    value={formData.cc}
                    onChange={handleInputChange("cc")}
                    placeholder={t("generator.optional")}
                  />
                </Field>
                <Field label={t("generator.bcc")}>
                  <Input
                    value={formData.bcc}
                    onChange={handleInputChange("bcc")}
                    placeholder={t("generator.optional")}
                  />
                </Field>
              </div>

              <Field label={t("generator.subject")}>
                <Input
                  value={formData.subject}
                  onChange={handleInputChange("subject")}
                  placeholder={t("generator.subjectPlaceholder")}
                />
              </Field>

              <Field label={t("generator.body")}>
                <Textarea
                  value={formData.body}
                  onChange={handleInputChange("body")}
                  resize="vertical"
                  rows={3}
                  placeholder={t("generator.bodyPlaceholder")}
                />
              </Field>
            </div>
          )}

          {generatedUrl && (
            <Field
              label={t("generator.generatedLink")}
              validationState={
                generatedUrl.startsWith("Error") ? "error" : "success"
              }
              style={{ marginTop: "10px" }}
            >
              <Input
                readOnly
                value={generatedUrl}
                className={styles.resultInput}
                contentAfter={
                  <Tooltip
                    content={
                      copied
                        ? t("generator.copied")
                        : t("generator.clickToCopy")
                    }
                    relationship="label"
                  >
                    <Button
                      appearance="subtle"
                      icon={
                        copied ? (
                          <CheckmarkCircle24Regular
                            color={tokens.colorPaletteGreenForeground1}
                          />
                        ) : (
                          <Copy24Regular />
                        )
                      }
                      onClick={copyToClipboard}
                      disabled={generatedUrl.startsWith("Error")}
                      aria-label="Copy URL"
                    />
                  </Tooltip>
                }
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            </Field>
          )}
        </div>
      </Card>
    </div>
  );
};
