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
  const [variablesData, setVariablesData] = useState([]);
  const [selectedText, setSelectedText] = useState('');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const currentTemplateID = '1';
    const data = sessionStorage.getItem('template-data') ?? jsonData;
    const formattedData = typeof data === 'object' ? data : JSON.parse(data);

    const templateData = formattedData.templates.filter(
      (template) => template.id === currentTemplateID
    )[0];

    if (searchParams.get('blank')) {
      setVariablesData(templateData.variables);
    } else {
      const variablesWithValues = templateData.variables.map((variable) => {
        const updatedVariable = {
          ...variable,
          value: dummyValues[variable.name],
        };
        return updatedVariable;
      });

      setVariablesData(variablesWithValues);
    }

    setTemplateContent(templateData.content);
    setData(templateData);

    sessionStorage.removeItem('template-data');
  }, [searchParams]);

  const handleConversionToVariable = (variableData) => {
    const { name, value } = variableData;
    const variableMarker = `{${name}}`;

    const updatedTemplateContent = templateContent.replace(
      new RegExp(`${value}`, 'g'),
      variableMarker
    );

    const templateVariablesData = [
      ...data.variables,
      { id: `${data.variables.length + 1}`, name },
    ];
    const updatedVariablesData = [...variablesData, variableData];

    setVariablesData(updatedVariablesData);
    setTemplateContent(updatedTemplateContent);
    setData({
      content: updatedTemplateContent,
      variables: templateVariablesData,
    });
    setSelectedText('');
  };

  const handleVariableValue = (variableID, variableName, variableValue) => {
    const modifiedContent = encodeTemplateString();

    setTemplateContent(modifiedContent);
    setData({
      ...data,
      content: modifiedContent,
    });

    let variables = variablesData.filter(
      (variable) => variable.name !== variableName
    );

    variables = [
      ...variables,
      { id: variableID, name: variableName, value: variableValue },
    ];
    variables.sort((a, b) => parseInt(a.id) - parseInt(b.id));

    setVariablesData(variables);
    setSelectedText('');
  };

  const encodeTemplateString = () => {
    let modifiedContent = templateContent;

    variablesData.forEach((variable) => {
      const placeholder = `<span class="variable ${
        variable.value ? '' : 'placeholder'
      }">${variable.value ?? variable.name}</span>`;

      modifiedContent = modifiedContent.replace(
        new RegExp(placeholder, 'g'),
        `{${variable.name}}`
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

  const handleVariableDeletion = (variable) => {
    const modifiedTemplate = encodeTemplateString();

    const placeholder = `{${variable.name}}`;
    const modifiedContent = modifiedTemplate.replace(
      new RegExp(placeholder, 'g'),
      `${variable.value ?? ''}`
    );

    const updatedTemplateVariables = data.variables.filter(
      (currentVar) => currentVar.name !== variable.name
    );
    const updatedVariablesData = variablesData.filter(
      (currentVar) => currentVar.name !== variable.name
    );

    setVariablesData(updatedVariablesData);
    setTemplateContent(modifiedContent);
    setData({
      content: modifiedContent,
      variables: updatedTemplateVariables,
    });
  };

  const handleCancel = () => {
    setSelectedText('');
  };

  return (
    <AppLayout>
      <div className="home-page">
        <section className="main-section">
          <div className="main-container">
            <TextBox
              data={data}
              setSelectedText={setSelectedText}
              setTemplateContent={setTemplateContent}
              variablesData={variablesData}
            />
            <div className="buttons-container">
              <Button>
                <PDFDownloadLink
                  document={
                    <PDFDocument
                      templateData={templateContent}
                      variablesData={variablesData}
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
            variablesData={variablesData}
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

export default HomePage;
