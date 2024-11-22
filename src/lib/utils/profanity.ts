import {
  englishDataset,
  englishRecommendedTransformers,
  RegExpMatcher,
} from 'obscenity';

// Create a new matcher using the English dataset and recommended transformers.
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

// Custom function to wrap detected profanities in double brackets.
export function wrapProfanities(input: string): string {
  // Use the matcher to find all matches in the input text.
  const matches = matcher.getAllMatches(input, true);

  // If no matches are found, return the original input.
  if (matches.length === 0) {
    return input;
  }

  // Sort matches in reverse order by startIndex to avoid indexing issues when replacing text.
  matches.sort((a, b) => b.startIndex - a.startIndex);

  // Replace each match with the wrapped version in double brackets.
  let modifiedInput = input;
  matches.forEach((match) => {
    const { phraseMetadata } =
      englishDataset.getPayloadWithPhraseMetadata(match);
    if (!phraseMetadata) return;
    const originalWord = phraseMetadata.originalWord;
    modifiedInput =
      modifiedInput.slice(0, match.startIndex) +
      `||${originalWord}||` +
      modifiedInput.slice(match.endIndex + 1);
  });

  return modifiedInput;
}

export function getAllLinks(text: string) {
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+?)/g;

  // Match URLs in the text and count them
  const matches = text.match(urlRegex);
  if (matches) {
    return matches.map((match) => match.trim());
  } else {
    return [];
  }
}
