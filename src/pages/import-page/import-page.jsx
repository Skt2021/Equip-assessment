import { useNavigate } from 'react-router-dom';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './importPage.scss';

import AppLayout from '../../components/layout/Layout';

export default function ImportPage() {
  const navigate = useNavigate();

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      const reader = new FileReader();
      reader.readAsText(info.file.originFileObj);
      reader.onload = () => {
        sessionStorage.setItem('template-data', reader.result);
        navigate(`/?blank=true`);
      };
    }
  };

  return (
    <AppLayout page="import">
      <div className="import-page">
        <Upload
          name="template-data"
          maxCount={1}
          accept=".json"
          customRequest={({ file, onSuccess }) =>
            setTimeout(() => onSuccess('OK'), 0)
          }
          onChange={handleChange}>
          <Button type="primary" size="large" icon={<UploadOutlined />}>
            Import Template
          </Button>
        </Upload>
      </div>
    </AppLayout>
  );
}
