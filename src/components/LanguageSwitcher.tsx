import React from "react";
import { Button, makeStyles, tokens } from "@fluentui/react-components";
import { LocalLanguage24Regular } from "@fluentui/react-icons";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  button: {
    position: "fixed",
    top: "16px",
    right: "16px",
    zIndex: 1000,
    minWidth: "auto",
    color: tokens.colorNeutralForeground2,
    ":hover": {
      color: tokens.colorBrandForeground1,
    },
  },
});

export const LanguageSwitcher: React.FC = () => {
  const styles = useStyles();
  const { i18n } = useTranslation();

  const toggle = () => {
    i18n.changeLanguage(i18n.language?.startsWith("zh") ? "en" : "zh");
  };

  const label = i18n.language?.startsWith("zh") ? "EN" : "中文";

  return (
    <Button
      className={styles.button}
      appearance="subtle"
      size="small"
      icon={<LocalLanguage24Regular />}
      onClick={toggle}
    >
      {label}
    </Button>
  );
};
