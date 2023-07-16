import { Divider, Form, Input, Row, Space, Tooltip, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './variablesTable.scss';

import { capitaliseFirstLetter } from '../../utils/helper';

const { Title } = Typography;

function VariablesTable({
  variablesData,
  variablesValues,
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
          const { name } = variable;
          const variableValue = variablesValues[name];

          return (
            <Form.Item
              style={{ width: '100%' }}
              key={name}
              name={name}
              label={capitaliseFirstLetter(name)}>
              <Space>
                <Input
                  value={variableValue}
                  defaultValue={variableValue}
                  placeholder={`Please enter ${name}`}
                  onChange={(e) => updateVariableValue(name, e.target.value)}
                />
                <Tooltip title="Delete Variable">
                  <DeleteOutlined
                    onClick={() => deleteVariable(name)}
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
