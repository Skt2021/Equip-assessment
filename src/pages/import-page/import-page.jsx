import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './importPage.scss';

import AppLayout from '../../components/layout/Layout';

export default function ImportPage() {
  const navigate = useNavigate();

  const handleImportTemplate = () => {
    navigate(`/?blank=true`);
  };

  return (
    <AppLayout page="import">
      <div className="import-page">
        <Button
          onClick={handleImportTemplate}
          type="primary"
          icon={<DownloadOutlined />}
          size="large">
          Import Template
        </Button>
      </div>
    </AppLayout>
  );
}
