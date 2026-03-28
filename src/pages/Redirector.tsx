import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  makeStyles,
  tokens,
  Spinner,
  Text,
  Button,
  Link,
  Divider,
} from "@fluentui/react-components";
import { Mail24Regular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";
import { algorithms, isMailtoContent } from "../utils/crypto";
import type { AlgorithmType } from "../utils/crypto";
import { ErrorPage } from "./ErrorPage";
import { useNotify } from "../context/ToastContext";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "80vh",
    gap: "24px",
    padding: "20px",
    textAlign: "center",
    color: tokens.colorNeutralForeground1,
    animationName: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    animationDuration: "0.5s",
  },
  iconSuccess: {
    color: tokens.colorBrandForeground1,
    marginBottom: "8px",
  },
  detailsCard: {
    width: "100%",
    maxWidth: "480px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    textAlign: "left",
    backgroundColor: tokens.colorNeutralBackgroundAlpha,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    borderRadius: tokens.borderRadiusMedium,
  },
  detailRow: {
    display: "grid",
    gridTemplateColumns: "60px 1fr",
    gap: "12px",
    alignItems: "baseline",
  },
  label: {
    color: tokens.colorNeutralForeground2,
    fontWeight: tokens.fontWeightSemibold,
    fontSize: tokens.fontSizeBase200,
    textAlign: "right",
  },
  value: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    wordBreak: "break-word",
    fontFamily: tokens.fontFamilyMonospace,
  },
  valueText: {
    color: tokens.colorNeutralForeground1,
    fontSize: tokens.fontSizeBase300,
    wordBreak: "break-word",
  },
  actionButtons: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "16px",
    width: "100%",
    maxWidth: "300px",
  },
});

interface MailDetails {
  to: string;
  cc?: string;
  bcc?: string;
  subject?: string;
  body?: string;
}

const parseMailtoLink = (link: string): MailDetails => {
  const urlStr = link.startsWith("mailto:") ? link : `mailto:${link}`;
  try {
    const url = new URL(urlStr);
    const params = url.searchParams;

    return {
      to: url.pathname,
      cc: params.get("cc") || undefined,
      bcc: params.get("bcc") || undefined,
      subject: params.get("subject") || undefined,
      body: params.get("body") || undefined,
    };
  } catch (e) {
    return { to: link.replace("mailto:", "") };
  }
};

export const Redirector: React.FC = () => {
  const styles = useStyles();
  const { method, payload } = useParams<{ method: string; payload: string }>();
  const notify = useNotify();
  const { t } = useTranslation();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [fullLink, setFullLink] = useState("");

  const [mailDetails, setMailDetails] = useState<MailDetails>({ to: "" });

  const [errorInfo, setErrorInfo] = useState({ msg: "", details: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      processUrl();
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, payload]);

  const processUrl = () => {
    if (!method || !payload) {
      setStatus("error");
      setErrorInfo({
        msg: t("redirector.missingParams"),
        details: "Missing Params",
      });
      return;
    }
    const algorithm = algorithms[method as AlgorithmType];
    if (!algorithm) {
      setStatus("error");
      setErrorInfo({
        msg: t("redirector.unsupportedAlgorithm", { method }),
        details: method,
      });
      return;
    }
    try {
      const decoded = algorithm.decrypt(payload);

      if (!isMailtoContent(decoded)) {
        setStatus("error");
        setErrorInfo({
          msg: t("redirector.decryptFormatError"),
          details: decoded.substring(0, 50),
        });
        return;
      }

      const details = parseMailtoLink(decoded);
      setMailDetails(details);

      const finalLink = decoded.startsWith("mailto:")
        ? decoded
        : `mailto:${decoded}`;
      setFullLink(finalLink);
      setStatus("success");

      window.location.href = finalLink;
    } catch (e) {
      setStatus("error");
      setErrorInfo({ msg: t("redirector.decryptError"), details: "Exception" });
    }
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        notify("success", t("redirector.copiedLabel", { label }), text);
      })
      .catch(() => {
        notify(
          "error",
          t("redirector.copyFailed"),
          t("redirector.clipboardError"),
        );
      });
  };

  if (status === "loading") {
    return (
      <div className={styles.container}>
        <Spinner size="huge" label={t("redirector.loading")} />
      </div>
    );
  }

  if (status === "error") {
    return <ErrorPage message={errorInfo.msg} details={errorInfo.details} />;
  }

  return (
    <div className={styles.container}>
      <div>
        <Mail24Regular fontSize={64} className={styles.iconSuccess} />
        <Text size={500} weight="bold" block>
          {t("redirector.readyToSend")}
        </Text>
        <Text size={200} style={{ color: tokens.colorNeutralForeground2 }}>
          {t("redirector.invokingClient")}
        </Text>
      </div>

      <div className={styles.detailsCard}>
        <div className={styles.detailRow}>
          <Text className={styles.label}>To:</Text>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Text className={styles.value} weight="semibold">
              {mailDetails.to}
            </Text>
          </div>
        </div>

        {mailDetails.cc && (
          <div className={styles.detailRow}>
            <Text className={styles.label}>CC:</Text>
            <Text className={styles.value}>{mailDetails.cc}</Text>
          </div>
        )}

        {mailDetails.bcc && (
          <div className={styles.detailRow}>
            <Text className={styles.label}>BCC:</Text>
            <Text className={styles.value}>{mailDetails.bcc}</Text>
          </div>
        )}

        {(mailDetails.subject || mailDetails.body) && <Divider />}

        {mailDetails.subject && (
          <div className={styles.detailRow}>
            <Text className={styles.label}>Subject:</Text>
            <Text className={styles.valueText} weight="medium">
              {mailDetails.subject}
            </Text>
          </div>
        )}

        {mailDetails.body && (
          <div className={styles.detailRow}>
            <Text className={styles.label}>Body:</Text>
            <Text
              className={styles.valueText}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                fontStyle: "italic",
                color: tokens.colorNeutralForeground2,
              }}
            >
              {mailDetails.body}
            </Text>
          </div>
        )}
      </div>

      <div className={styles.actionButtons}>
        <Button
          appearance="primary"
          size="large"
          onClick={() => (window.location.href = fullLink)}
        >
          {t("redirector.openMailApp")}
        </Button>

        <Button
          appearance="subtle"
          onClick={() =>
            handleCopy(mailDetails.to, t("redirector.recipientLabel"))
          }
        >
          {t("redirector.copyRecipient")}
        </Button>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link href="/">{t("redirector.generateLink")}</Link>
      </div>
    </div>
  );
};
