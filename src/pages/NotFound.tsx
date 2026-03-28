import React from "react";
import {
  makeStyles,
  tokens,
  Text,
  Button,
  shorthands,
} from "@fluentui/react-components";
import {
  QuestionCircle48Regular,
  Home24Regular,
  ArrowReply24Regular,
} from "@fluentui/react-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    textAlign: "center",
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding("24px"),
    boxSizing: "border-box",
    animationName: {
      from: { opacity: 0, transform: "scale(0.95) translateY(10px)" },
      to: { opacity: 1, transform: "scale(1) translateY(0)" },
    },
    animationDuration: "0.4s",
    animationTimingFunction: "cubic-bezier(0.33, 1, 0.68, 1)",
  },
  contentWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  errorCode: {
    fontSize: "120px",
    lineHeight: "1",
    fontWeight: tokens.fontWeightBold,
    color: tokens.colorNeutralForegroundDisabled,
    ...shorthands.margin(0),
    textShadow: `2px 2px 0px ${tokens.colorNeutralBackground1}`,
  },
  headingGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    maxWidth: "400px",
    lineHeight: "1.5",
  },
  icon: {
    fontSize: "64px",
    color: tokens.colorBrandForeground1,
    marginBottom: "8px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "24px",
    width: "100%",
    maxWidth: "300px",
    "@media (min-width: 600px)": {
      flexDirection: "row",
      width: "auto",
      maxWidth: "none",
    },
  },
  mainButton: {
    minWidth: "140px",
  },
});

export const NotFound: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <QuestionCircle48Regular className={styles.icon} aria-hidden="true" />

        <div className={styles.headingGroup}>
          <h1 className={styles.errorCode}>404</h1>
          <Text weight="semibold" size={700} className={styles.title}>
            {t("notFound.title")}
          </Text>
          <Text size={400} className={styles.description}>
            {t("notFound.description")}
          </Text>
        </div>

        <div className={styles.buttonGroup}>
          <Button
            appearance="primary"
            size="large"
            icon={<Home24Regular />}
            onClick={() => navigate("/")}
            className={styles.mainButton}
          >
            {t("notFound.goHome")}
          </Button>

          <Button
            appearance="subtle"
            size="large"
            icon={<ArrowReply24Regular />}
            onClick={() => navigate(-1)}
          >
            {t("notFound.goBack")}
          </Button>
        </div>
      </div>
    </div>
  );
};
