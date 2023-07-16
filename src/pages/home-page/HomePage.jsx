import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import './homePage.scss';

import AppLayout from '../../components/layout/Layout';
import TextBox from '../../components/text-box/TextBox';
import VariablesTable from '../../components/variables-table/VariablesTable';
import CustomModal from '../../components/custom-modal/CustomModal';
import PDFDocument from '../../components/pdf-document/PDFDocument';

import jsonData from '../../data/data.json';
import { dummyValues } from '../../data/variableData';

function HomePage() {
  const [data, setData] = useState();
  const [templateContent, setTemplateContent] = useState();
  const [variablesValues, setVariablesValues] = useState({});
  const [selectedText, setSelectedText] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentTemplateID = '1';
    const data = sessionStorage.getItem('template-data') ?? jsonData;
    const formattedData = typeof data === 'object' ? data : JSON.parse(data);

    const templateData = formattedData.templates.filter(
      (template) => template.id === currentTemplateID
    )[0];

    if (!searchParams.get('blank')) {
      setVariablesValues(dummyValues);
    }

    setTemplateContent(templateData.content);
    setData(templateData);

    sessionStorage.removeItem('template-data');
  }, [searchParams]);

  const handleConversionToVariable = (variableData) => {
    const { name, value } = variableData;
    const variableMarker = `{${name}}`;

    const modifiedContent = encodeTemplateString();
    const updatedTemplateContent = modifiedContent.replace(
      new RegExp(`${value}`, 'g'),
      variableMarker
    );

    const existingVariable = data.variables.reduce(
      (acc, current) => acc || name === current.name,
      false
    );

    const templateVariablesData = [...data.variables];
    if (!existingVariable) {
      templateVariablesData.push({ name });
      const updatedVariablesData = {
        ...variablesValues,
        [name]: value,
      };
      setVariablesValues(updatedVariablesData);
    }

    setTemplateContent(updatedTemplateContent);
    setData({
      content: updatedTemplateContent,
      variables: templateVariablesData,
    });
    setSelectedText('');
  };

  const handleVariableValue = (variableName, variableValue) => {
    const modifiedContent = encodeTemplateString();

    let variables = {
      ...variablesValues,
      [variableName]: variableValue,
    };

    setTemplateContent(modifiedContent);
    setData({
      ...data,
      content: modifiedContent,
    });
    setVariablesValues(variables);
    setSelectedText('');
  };

  const encodeTemplateString = () => {
    let modifiedContent = templateContent;

    data.variables.forEach((variable) => {
      const { name } = variable;
      const variableValue = variablesValues[name];

      const placeholder = `<span class="variable ${
        variableValue ? '' : 'placeholder'
      }">${variableValue ?? name}</span>`;

      modifiedContent = modifiedContent.replace(
        new RegExp(placeholder, 'g'),
        `{${name}}`
      );
    });

    return modifiedContent;
  };

  const saveAsTemplate = () => {
    const modifiedContent = encodeTemplateString();

    setTemplateContent(modifiedContent);
    setData({
      ...data,
      content: modifiedContent,
    });

    const templateData = {
      templates: [
        {
          id: '1',
          content: modifiedContent,
          variables: data.variables,
        },
      ],
    };

    const formattedTemplateData = JSON.stringify(templateData, null, 2);
    const blob = new Blob([formattedTemplateData], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'template-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleVariableDeletion = (variableName) => {
    const modifiedTemplate = encodeTemplateString();

    const placeholder = `{${variableName}}`;
    const modifiedContent = modifiedTemplate.replace(
      new RegExp(placeholder, 'g'),
      `${variablesValues[variableName] ?? ''}`
    );

    const updatedTemplateVariables = data.variables.filter(
      (currentVar) => currentVar.name !== variableName
    );
    delete variablesValues[variableName];

    setVariablesValues({ ...variablesValues });
    setTemplateContent(modifiedContent);
    setData({
      content: modifiedContent,
      variables: updatedTemplateVariables,
    });
  };

  const handleCancel = () => {
    setSelectedText('');
  };

  if (data) {
    return (
      <AppLayout>
        <div className="home-page">
          <section className="main-section">
            <div className="main-container">
              <TextBox
                data={data}
                setSelectedText={setSelectedText}
                setTemplateContent={setTemplateContent}
                variablesValues={variablesValues}
              />
              <div className="buttons-container">
                <Button>
                  <PDFDownloadLink
                    document={
                      <PDFDocument
                        templateData={templateContent}
                        variablesData={data.variables}
                        variablesValues={variablesValues}
                      />
                    }
                    fileName="offer-letter.pdf">
                    {({ loading }) =>
                      loading ? 'Loading document...' : 'Export'
                    }
                  </PDFDownloadLink>
                </Button>
                <Button onClick={saveAsTemplate}>Save as Template</Button>
              </div>
            </div>
          </section>
          <section className="variables-section">
            <VariablesTable
              variablesData={data.variables}
              variablesValues={variablesValues}
              updateVariableValue={handleVariableValue}
              deleteVariable={handleVariableDeletion}
            />
          </section>
        </div>
        {selectedText && (
          <CustomModal
            makeVariable={handleConversionToVariable}
            handleCancel={handleCancel}
            selectedText={selectedText}
          />
        )}
      </AppLayout>
    );
  }
  return <></>;
}

export default HomePage;
