import { Divider, Form, Input, Row, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './variablesTable.scss';

import { capitaliseFirstLetter } from '../../utils/helper';

const { Title } = Typography;

function VariablesTable({
  variablesData,
  updateVariableValue,
  deleteVariable,
}) {
  return (
    <Space className="variable-table" direction="vertical">
      <Row className="title">
        <Title level={3}>Manage Variables</Title>
      </Row>
      <Divider className="divider" />
      <Form layout="vertical" className="variable-form">
        {variablesData?.map((variable) => {
          return (
            <Form.Item
              style={{ width: '100%' }}
              key={variable.name}
              name={variable.name}
              label={capitaliseFirstLetter(variable.name)}>
              <Space>
                <Input
                  value={variable.value}
                  defaultValue={variable.value}
                  placeholder={`Please enter ${variable.name}`}
                  onChange={(e) =>
                    updateVariableValue(
                      variable.id,
                      variable.name,
                      e.target.value
                    )
                  }
                />
                <Tooltip title="Delete Variable">
                  <DeleteOutlined
                    onClick={() => deleteVariable(variable)}
                    style={{ color: '#f5222d' }}
                    type="danger"
                  />
                </Tooltip>
              </Space>
            </Form.Item>
          );
        })}
      </Form>
    </Space>
  );
}

export default VariablesTable;
