import React from 'react';
import {
  makeStyles,
  tokens,
  Text,
  Button,
  Card,
  CardFooter
} from '@fluentui/react-components';
import {
  ErrorCircle48Regular,
  Home24Regular
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '80vh',
    padding: '20px',
    animationName: {
      from: { opacity: 0, transform: 'translateY(10px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    animationDuration: '0.4s',
    animationFillMode: 'forwards',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    textAlign: 'center',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    boxShadow: tokens.shadow16,
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: tokens.colorPaletteRedBackground2,
    color: tokens.colorPaletteRedForeground1,
    marginBottom: '8px',
  },
  title: {
    color: tokens.colorNeutralForeground1,
    textAlign: 'center',
  },
  description: {
    color: tokens.colorNeutralForeground2,
    textAlign: 'center',
    maxWidth: '300px',
    lineHeight: '1.5',
  }
});

interface ErrorPageProps {
  message: string;
  details?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ message }) => {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.iconContainer}>
          <ErrorCircle48Regular fontSize={40} />
        </div>

        <Text weight="bold" size={700} className={styles.title} block>
          无法解析链接
        </Text>

        <Text size={400} className={styles.description} block>
          {message}
        </Text>

        <CardFooter style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
          <Button
            appearance="primary"
            size="large"
            icon={<Home24Regular />}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
