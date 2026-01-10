import React from 'react';
import { 
  makeStyles, 
  tokens, 
  Text, 
  Button,
  shorthands,
  mergeClasses
} from '@fluentui/react-components';
import { 
  QuestionCircle48Regular, 
  Home24Regular,
  ArrowReply24Regular
} from '@fluentui/react-icons';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // 占满视口高度，保证垂直居中
    height: '100vh', 
    width: '100%',
    textAlign: 'center',
    backgroundColor: tokens.colorNeutralBackground2,
    ...shorthands.padding('24px'),
    boxSizing: 'border-box',
    
    // 进场动画
    animationName: {
      from: { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
      to: { opacity: 1, transform: 'scale(1) translateY(0)' },
    },
    animationDuration: '0.4s',
    animationTimingFunction: 'cubic-bezier(0.33, 1, 0.68, 1)', // 更平滑的曲线
  },
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px', // 控制垂直元素的间距
  },
  errorCode: {
    fontSize: '120px',
    lineHeight: '1',
    fontWeight: tokens.fontWeightBold,
    // 使用 Brand 颜色或更淡的颜色，视设计风格而定
    color: tokens.colorNeutralForegroundDisabled, 
    ...shorthands.margin(0),
    // 添加一点文字阴影增加层次感 (可选)
    textShadow: `2px 2px 0px ${tokens.colorNeutralBackground1}`,
  },
  headingGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  title: {
    color: tokens.colorNeutralForeground1,
  },
  description: {
    color: tokens.colorNeutralForeground2,
    maxWidth: '400px',
    lineHeight: '1.5',
  },
  icon: {
    fontSize: '64px', // 显式控制图标大小
    color: tokens.colorBrandForeground1,
    marginBottom: '8px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginTop: '24px',
    width: '100%',
    maxWidth: '300px', // 限制按钮最大宽度
    
    // 在大屏幕上横向排列按钮
    '@media (min-width: 600px)': {
      flexDirection: 'row',
      width: 'auto',
      maxWidth: 'none',
    },
  },
  mainButton: {
    minWidth: '140px',
  }
});

export const NotFound: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        
        {/* 顶部图标 */}
        <QuestionCircle48Regular className={styles.icon} aria-hidden="true" />
        
        {/* 文本区域 */}
        <div className={styles.headingGroup}>
          <h1 className={styles.errorCode}>404</h1>
          <Text weight="semibold" size={700} className={styles.title}>
            页面未找到
          </Text>
          <Text size={400} className={styles.description}>
            抱歉，您访问的页面不存在或已被移除。
          </Text>
        </div>

        {/* 按钮区域 */}
        <div className={styles.buttonGroup}>
          <Button 
            appearance="primary" 
            size="large" 
            icon={<Home24Regular />}
            onClick={() => navigate('/')}
            className={styles.mainButton}
          >
            返回首页
          </Button>
          
          <Button 
            appearance="subtle" 
            size="large"
            icon={<ArrowReply24Regular />}
            onClick={() => navigate(-1)}
          >
            返回上一页
          </Button>
        </div>

      </div>
    </div>
  );
};
