import { PartyData } from "../components/EditableTable";

export function calculateMandates(
  partyData: PartyData[],
  totalMandates: number
): PartyData[] {
  const quotients: { name: string; quotient: number }[] = [];

  partyData.forEach((party) => {
    for (let i = 1; i <= totalMandates; i++) {
      if (party.percentage >= 5)
        quotients.push({ name: party.name, quotient: party.percentage / i });
    }
  });

  quotients.sort((a, b) => b.quotient - a.quotient);

  const allocation: { [key: string]: number } = {};
  partyData.forEach((party) => (allocation[party.name] = 0));

  for (let i = 0; i < totalMandates; i++) {
    allocation[quotients[i].name]++;
  }

  return partyData.map((party) => ({
    ...party,
    mandates: allocation[party.name],
  }));
}
