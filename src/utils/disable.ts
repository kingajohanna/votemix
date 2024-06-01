export const isVoteDisabled = () => {
  return new Date().getTime() >= new Date("2024-06-09T00:00:00Z").getTime();
};
