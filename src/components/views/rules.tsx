import { Box, Card, useTheme } from "@mui/material";
import { intersection } from "lodash";
import { sortBy, uniqBy } from "lodash/fp";
import ReactMarkdown from "react-markdown";
import {
  formatRule,
  getItemFromId,
  getPerk,
  getRule,
  isEquippable,
} from "utils/data";

function EffectViewWrapper(props: any) {
  const { variant, children } = props;
  const theme = useTheme();
  if (variant === "cards") {
    return <Card variant="outlined" sx={{ mb: 1, px: 1, py: 2, borderLeft: `5px solid ${theme.palette.primary.main}` }}>{children}</Card>;
  } else {
    return <Box sx={{ mb: 1 }}>{children}</Box>
  }
}

function renderThings(things: any, variant: string) {
  return (
    <>
      {things?.map((thingy: any, index: number) => {
        const thing = thingy?.thing;
        const thingData = thingy?.data;
        const variables: Record<string, any> = {};
        thingData?.inputs?.forEach((input: any) => {
          variables[input] = thing[input];
        });
        if (!thingData?.rules) {
          return null;
        }
        const rulesText = thingData?.rules?.map((rule: any) => {
          // If it doesn't have an id and isn't a string, it's an inline rule
          const ruleData = getRule(rule);
          ruleData?.inputs?.forEach((input: any) => {
            variables[input] = rule[input];
          });
          const formattedRule = formatRule(ruleData, variables);
          return formattedRule;
        });
        return (
          <EffectViewWrapper variant={variant} key={index}>
            <ReactMarkdown
              className="markdown"
              children={`**${thingData?.name}${(thingData?.inputs || []).map((va: string) => ` (${variables[va]})`)}:** ${rulesText?.join(' ')}`}
            />
          </EffectViewWrapper>
        );
      })}
    </>
  );
}

export function RuleView(props: any) {
  const { items = [], perks = [], variant = "list", activeOnly = false, typeFilters = [] } = props;
  const thingData = [
    ...(perks?.map((perk: any) => ({ thing: perk, data: getPerk(perk) }))),
    ...(items?.map((item: any) => ({ thing: item, data: getItemFromId(item) })))
  ];
  const filteredThings = thingData?.filter((thingAndData: any) => {
    const activeItem = (isEquippable(thingAndData?.data) && thingAndData?.thing?.active) || !thingAndData?.thing?.id || !isEquippable(thingAndData?.data);
    return activeOnly ? activeItem : true;
  }).filter((thingAndData: any) => {
    const ruleTypes = thingAndData?.data?.rules?.map((rule: any) => getRule(rule)?.type);
    return !!intersection(ruleTypes, typeFilters).length || !typeFilters.length;
  })
  const uniqueThings: any = sortBy((thing: any) => thing?.data?.name, uniqBy((thing: any) => JSON.stringify(thing?.thing), filteredThings));
  return (
    <>
      {renderThings(uniqueThings, variant)}
    </>
  );
}
