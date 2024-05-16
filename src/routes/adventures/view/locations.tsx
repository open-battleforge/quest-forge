// import AddIcon from '@mui/icons-material/Add';
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ViewIcon from "@mui/icons-material/Visibility";
import {
  CardContent,
  Divider,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { Dropdown } from "components/dropdown";
import {
  getStory,
} from "utils/data";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
// import useConfirmation from "components/modals/confirm";
import ReactMarkdown from "react-markdown";
import Show from "components/show";
import { ContextToolbar } from "components/context-toolbar";
import { DataGrid } from "@mui/x-data-grid";

export function NPCs(props: any) {
  const theme = useTheme();
  const { character } = props;
  const story = getStory(character?.story);
  const activeScenarioId = character?.activeScenario || 0;
  const activeStoryScenario = story?.scenarios?.[activeScenarioId] || {};
  const filters = ["Armor", "Weapon", "Gear", "Spell"];
  return (
    <>
      {Object.keys(activeStoryScenario?.locations || {})?.map(
        (location: any, index: number) => {
          const resolution = activeStoryScenario?.locations?.[location] || {};
          const contextActions = [
            {
              name: "View",
              icon: <ViewIcon />,
              onClick: () => {},
            },
            {
              name: "Add",
              icon: <AddIcon />,
              onClick: () => {},
            },
            {
              name: "Edit",
              icon: <EditIcon />,
              onClick: () => {},
            },
            {
              name: "Delete",
              icon: <DeleteIcon />,
              onClick: () => {},
            },
          ];
          return (
            <>
              <Card
                variant="outlined"
                sx={{
                  mb: 1,
                  borderLeft: `5px solid ${theme.palette.primary.main}`,
                }}
                key={index}
              >
                <Dropdown>
                  {({ handleClose, open, handleOpen }: any) => (
                    <>
                      <ListItemButton
                        sx={{
                          pl: 2,
                        }}
                        onClick={() => (open ? handleClose() : handleOpen())}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="h6" fontWeight="bold">
                              {resolution?.name}
                            </Typography>
                          }
                        />
                        {open ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={open} timeout="auto" unmountOnExit>
                        <CardContent>
                          <ReactMarkdown
                            className="markdown paragraphs"
                            children={resolution?.description}
                          />
                          <Divider sx={{ my: 2 }} />
                          <ContextToolbar
                            contextActions={contextActions}
                            filters={filters}
                            label="Room Contents"
                          />
                          <DataGrid
                            sx={{
                              borderColor: "rgba(255, 255, 255, 0.12)",
                              fontSize: "12px",
                              "& .MuiDataGrid-columnHeaderTitle": {
                                fontSize: "11px",
                              },
                              "& .MuiDataGrid-withBorderColor": {
                                borderColor: "rgba(255, 255, 255, 0.12)",
                              },
                            }}
                            disableRowSelectionOnClick
                            checkboxSelection
                            autoHeight
                            initialState={{
                              pagination: {
                                paginationModel: { pageSize: 25, page: 0 },
                              },
                            }}
                            pageSizeOptions={[]}
                            rows={[]}
                            columns={[]}
                          />
                          <Show when={resolution?.connections}>
                            <Divider sx={{ my: 2 }} />
                            <Typography>
                              Connections:{" "}
                              {(resolution?.connections || [])
                                ?.map(
                                  (connection: any) =>
                                    activeStoryScenario?.locations?.[connection]
                                      ?.name || "Not found"
                                )
                                ?.join(", ")}
                            </Typography>
                          </Show>
                        </CardContent>
                      </Collapse>
                    </>
                  )}
                </Dropdown>
              </Card>
            </>
          );
        }
      )}
    </>
  );
}
