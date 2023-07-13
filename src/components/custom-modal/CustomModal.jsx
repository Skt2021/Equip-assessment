import { useEffect, useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';

const CustomModal = ({ makeVariable, handleCancel, selectedText }) => {
  const [variableName, setvariableName] = useState('');
  const [variableValue, setVariableValue] = useState(selectedText);
  const [form] = Form.useForm();

  useEffect(() => {
    setVariableValue(selectedText);
  }, [selectedText]);

  const handleSubmit = () => {
    if (variableName) {
      makeVariable({
        name: variableName,
        value: variableValue,
      });
    }
  };

  return (
    <Modal
      title="Turn into Variable"
      open={!!selectedText}
      onCancel={handleCancel}
      footer={null}
      centered>
      <Form
        form={form}
        layout="vertical"
        className="variable-form"
        requiredMark={false}>
        <Form.Item
          name="variable-name"
          label="Enter Variable Name"
          rules={[{ required: true, message: 'Please enter name!' }]}>
          <Input
            value={variableName}
            placeholder="Please enter name"
            onChange={(e) => setvariableName(e.target.value)}
          />
        </Form.Item>
        <Form.Item name="variableValue" label="Enter Variable Value">
          <Input
            value={variableValue}
            defaultValue={selectedText}
            placeholder="Please enter value"
            onChange={(e) => setVariableValue(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button key="submit" type="primary" onClick={handleSubmit}>
            Convert To Variable
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomModal;
