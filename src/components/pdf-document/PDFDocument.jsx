import { Page, Document, StyleSheet } from '@react-pdf/renderer';
import Html from 'react-pdf-html';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: '40px',
  },
});

const PDFDocument = ({ templateData, variablesData, variablesValues }) => {
  let modifiedText;

  if (templateData) {
    modifiedText = templateData;

    variablesData.forEach((variable) => {
      const { name } = variable;

      const placeholder = `{${name}}`;
      const variableValue = `${variablesValues[name] ?? ''}`;

      modifiedText = modifiedText.replace(
        new RegExp(placeholder, 'g'),
        variableValue
      );
    });
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Html>{modifiedText}</Html>
      </Page>
    </Document>
  );
};

export default PDFDocument;
