export const isVoteDisabled = () => {
  return new Date().getTime() >= new Date("2024-06-09T10:00:00Z").getTime();
};
