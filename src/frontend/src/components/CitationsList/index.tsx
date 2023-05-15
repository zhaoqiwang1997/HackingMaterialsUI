import React from 'react';
import { BibFilePresenter, parseBibFile } from 'bibtex';
import { CitationWrapper } from './styled';

type CitationsListProps = {
  bibtexCitations: string[];
};

function CitationsList({ bibtexCitations }: CitationsListProps) {
  const unavailableCitationsMessage = <div>Citations not available.</div>;
  const Citation = ({
    bibFile,
    entryKey,
  }: {
    bibFile: BibFilePresenter;
    entryKey: string;
  }) => {
    const entry = bibFile.getEntry(entryKey);
    const fieldsKeys = Object.keys(entry?.fields || {});

    if (fieldsKeys.length) {
      const formattedFields = fieldsKeys.map((fieldKey: string) => {
        const value = entry?.getFieldAsString(fieldKey);
        const fieldName = fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1);
        return (
          <div key={fieldKey}>
            <b>{fieldName}:</b> {value}
          </div>
        );
      });
      return (
        <CitationWrapper key={entryKey}>{formattedFields}</CitationWrapper>
      );
    } else {
      return <div>{entryKey}</div>;
    }
  };

  try {
    const sanitisedBibtexCitations = bibtexCitations.map((rawEntryBibtex) => {
      const sanitisedEntryBibtex =
        rawEntryBibtex
          .replace(
            /(})(\s*,*\s*)(\w+\s*=)/g, // this is regex that says to capture anything between a '}' character and a word that is followed by a '=' character
            '$1, $3', // ensure there is a comma between the '}' and the word after it
          )
          .replace(
            /({)(\s*,*\s*)(\w+\s*)/g, // this is regex that says to capture anything between a '{' character and a word
            '$1$3', // remove anything in between (as some citations had a ',' character that causes errors)
          ) + '}'; // some citations are missing the closing bracket, so we add it here just in case
      return sanitisedEntryBibtex;
    });

    if (sanitisedBibtexCitations.length === 0) {
      return unavailableCitationsMessage;
    }

    const bibFile = parseBibFile(sanitisedBibtexCitations.join(',')); // join all the different citations with a comma between them

    return (
      <div>
        {Object.keys(bibFile.entries$).map((entryKey: string) => (
          <Citation key={entryKey} bibFile={bibFile} entryKey={entryKey} />
        ))}
      </div>
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Following error occured when processing citations:', error);
    return unavailableCitationsMessage;
  }
}

export default CitationsList;
