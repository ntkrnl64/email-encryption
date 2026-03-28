import React from "react";
import {
  makeStyles,
  tokens,
  Link,
  Text,
  Divider,
} from "@fluentui/react-components";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles({
  footer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    marginTop: "auto",
    gap: "8px",
    backgroundColor: tokens.colorNeutralBackground2,
    color: tokens.colorNeutralForeground3,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: tokens.fontSizeBase200,
  },
  link: {
    fontSize: tokens.fontSizeBase200,
    color: tokens.colorNeutralForeground3,
    ":hover": {
      color: tokens.colorBrandForeground1,
    },
  },
});

export const Footer: React.FC = () => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          marginBottom: "10px",
          opacity: 0.3,
        }}
      >
        <Divider />
      </div>

      <div className={styles.row}>
        <Text>{t("footer.license")}</Text>
        <Text>|</Text>
        <Link
          href="https://github.com/ntkrnl64/email-encryption"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {t("footer.github")}
        </Link>
      </div>

      <div className={styles.row}>
        <Text size={100} style={{ opacity: 0.7 }}>
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </Text>
      </div>
    </footer>
  );
};
