import { Layout, Menu, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './layout.scss';

const { Header, Content } = Layout;
const { Title } = Typography;

const MenuItems = [{ name: 'Import a Template', link: '/import' }];

const AppLayout = ({ children, page }) => {
  const navigate = useNavigate();

  const redirectToHome = () => {
    navigate('/');
  };

  return (
    <Layout className="layout">
      <Header className="header">
        <Title className="title" onClick={redirectToHome}>
          Templete Generator
        </Title>
        {page !== 'import' && (
          <Menu className="menu" mode="horizontal">
            {MenuItems.map((item) => (
              <Menu.Item className="menu-item" key={item.name} icon={null}>
                <a href={item.link}>{item.name}</a>
              </Menu.Item>
            ))}
          </Menu>
        )}
      </Header>
      <Content className="content">{children}</Content>
    </Layout>
  );
};

export default AppLayout;
