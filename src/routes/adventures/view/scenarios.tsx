import {
  Box,
  Card,
  useMediaQuery,
  ListItemButton,
  ListItemText,
  useTheme,
  Collapse,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import ReactMarkdown from "react-markdown";
import { getStory } from "utils/data";
import * as React from "react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Show from "components/show";
import { Dropdown } from "components/dropdown";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { findIndex } from "lodash";

export const Scenario = (props: any) => {
  const { character, setCharacter } = props;
  const story = getStory(character?.story);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.up("md"));
  const activeStep =
    findIndex(
      Object.keys(story?.scenarios),
      (scenarioKey) => character?.activeScenario === scenarioKey
    ) || 0;
  const setActiveStep = (activeScenario: number) => {
    const activeScenarioId = Object.keys(story?.scenarios)[activeScenario];
    setCharacter({
      ...character,
      activeScenario: activeScenarioId,
    });
  };

  const scenarios: Array<{
    name: string;
    description: string;
    introduction: string;
    resolutions: Array<{ name: string; description: string }>;
  }> = Object.values(story?.scenarios);

  const activeScenario = scenarios[activeStep];

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          mb: 1,
          p: 1,
          borderLeft: `5px solid ${theme.palette.primary.main}`,
        }}
      >
        <Stepper
          sx={{ py: fullScreen ? 2 : 0 }}
          activeStep={activeStep}
          orientation={fullScreen ? "horizontal" : "vertical"}
        >
          {scenarios.map((step, index) => (
            <Step sx={{ p: 0 }} key={step.name}>
              <StepLabel onClick={() => setActiveStep(index)}>
                <Typography className="clickable">{step.name}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>
      <Show when={!!activeScenario?.introduction}>
        <Card
          variant="outlined"
          sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
        >
          <Typography
            sx={{
              p: 1,
            }}
            variant="h5"
          >
            {activeScenario?.name}
          </Typography>
          <Box sx={{ p: 1 }}>
            <ReactMarkdown
              className="markdown paragraphs"
              children={activeScenario?.introduction}
            />
          </Box>
        </Card>
      </Show>
      <Show when={!activeScenario?.introduction}>
        <Card
          variant="outlined"
          sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }}
        >
          <Box sx={{ p: 1, py: 2 }}>
            This scenario contains no introduction...
          </Box>
        </Card>
      </Show>
      <Show when={!!activeScenario?.resolutions}>
        {Object.values(activeScenario?.resolutions || {})?.map(
          (resolution: any, index: number) => {
            return (
              <Card variant="outlined" sx={{ mb: 1, borderLeft: `5px solid ${theme.palette.primary.main}` }} key={index}>
                <Dropdown>
                  {({ handleClose, open, handleOpen }: any) => (
                    <>
                      <ListItemButton
                        sx={{ pl: 1.5 }}
                        onClick={() => (open ? handleClose() : handleOpen())}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h6">
                              Resolution {index + 1}
                            </Typography>
                          }
                        />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ p: 1 }}>
                          <Typography
                            sx={{
                              pb: 1,
                            }}
                            variant="h5"
                          >
                            {resolution?.name}
                          </Typography>
                          <ReactMarkdown
                            className="markdown paragraphs"
                            children={resolution?.description}
                          />
                        </Box>
                      </Collapse>
                    </>
                  )}
                </Dropdown>
              </Card>
            );
          }
        )}
      </Show>
    </>
  );
};
