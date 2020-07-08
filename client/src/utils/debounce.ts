import * as React from 'react';
import { useAsync } from 'react-async-hook';
import useConstant from 'use-constant';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

const useDebouncedSearch = (searchFunction: (searchString: string) => any) => {
  const [inputText, setInputText] = React.useState('');

  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return [];
    } else {
      return debouncedSearchFunction(inputText);
    }
  }, [debouncedSearchFunction, inputText]);

  return {
    inputText,
    setInputText,
    searchResults,
  };
};

export default useDebouncedSearch;
