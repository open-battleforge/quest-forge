import {
  Box,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useModal } from "hooks/use-modal";
import { BuyEquipment, EditItem } from "../modals";
import { getItems, getItemsFromIds } from "utils/data";
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  gridStringOrNumberComparator,
} from "@mui/x-data-grid";
import { useState } from "react";
import { intersection } from "lodash";
import useConfirmation from "components/modals/confirm";
import { ContextToolbar } from "components/context-toolbar";

export default function Equipment(props: any) {
  const { character, setCharacter } = props;
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const equipment = getItems();
  const inventory = getItemsFromIds(
    character?.inventory || [].map((item: any) => item?.id)
  ).map((item: any, index: number) => ({
    ...item,
    count: character?.inventory?.[index]?.count,
    index: index
  }));
  const filters = ["Armor", "Weapon", "Gear", "Spell"];
  const [activeFilters, setActiveFilters] = useState(new Set());
  const toggleFilter = (filter: any) => {
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }
    setActiveFilters(new Set(activeFilters));
  };
  const inventoryFiltered = inventory.filter((equip: any) => {
    const activeFiltersArr = Array.from(activeFilters);
    return (
      intersection(activeFiltersArr, equip.keywords).length || !activeFiltersArr.length
    );
  });
  const [showEditItemMenu, hideEditItemMenu] = useModal(
    ({ extraProps }: any) => (
      <EditItem
        hideModal={hideEditItemMenu}
        character={character}
        setCharacter={setCharacter}
        itemIndex={selectedRows[0]}
        {...extraProps}
      />
    ),
    [ character, character?.inventory ]
  );
  const [showBuyMenu, hideBuyMenu] = useModal(
    () => (
      <BuyEquipment
        hideModal={hideBuyMenu}
        equipment={equipment}
        addItem={addItem}
        character={character}
      />
    ),
    [character, character?.inventory]
  );
  const addItem = (item: any) => {
    setCharacter({
      ...character,
      inventory: [...(character?.inventory || []), { id: item, count: 1 }],
    });
  };

  const showConfirmDeleteItems = useConfirmation({
    title: "Delete Items",
    onConfirm: ({ indexes }: any) => {
      const itemsToRemove = new Set(indexes);
      setCharacter({
        ...character,
        inventory: [
          ...character?.inventory?.filter(
            (item: any, index: number) => !itemsToRemove.has(index)
          ),
        ],
      });
      setSelectedRows([]);
    }
  });

  const removeItems = (indexes: any) => {
    showConfirmDeleteItems({ indexes });
  };

  const handleRowSelection = (ids: any) => {
    setSelectedRows(ids);
  };

  const nameSortComparator = (v1: any, v2: any, param1: any, param2: any) => {
    return gridStringOrNumberComparator(v1.name, v2.name, param1, param2);
  };

  const columns: GridColDef[] = [
    {
      field: "value",
      headerName: "Name",
      renderCell: (params: any) => (
        <Stack>
          <Typography fontSize="13px">{params?.value?.name} {params?.value?.count > 1 ? `(${params?.value?.count})` : ''}</Typography>
          <Typography fontSize="10px">
            {params?.value?.keywords?.slice(0, 2)?.join(" - ")}
          </Typography>
        </Stack>
      ),
      sortComparator: nameSortComparator,
      valueFormatter: (params) => {
        return params.value?.name;
      },
      flex: 3,
    },
    { field: "weight", headerName: "Weight", flex: 1 },
    {
      field: "col2",
      headerName: "Value",
      valueFormatter: (params) => {
        return `${params.value} gp`;
      },
      flex: 1,
    },
  ];

  const rows: GridRowsProp = inventoryFiltered.map(
    (item: any) => ({
      id: item.index,
      value: item,
      col2: item?.cost,
      weight: item.weight,
      count: character?.inventory?.[item.index]?.count,
    })
  );

  const contextActions = [
    {
      name: "Add",
      icon: <AddIcon />,
      onClick: () => {
        showBuyMenu();
      },
    },
    {
      name: "Edit",
      icon: <EditIcon />,
      disabled: selectedRows.length !== 1,
      onClick: () => {
        showEditItemMenu();
      },
    },
    {
      name: "Delete",
      icon: <DeleteIcon />,
      disabled: selectedRows.length < 1,
      onClick: () => {
        removeItems(selectedRows);
      },
    },
  ];
  return (
    <>
      <Box sx={{ my: 1 }}>
        <Box>
          {filters.map((filter) => (
            <Chip
              label={filter}
              variant={activeFilters.has(filter) ? "filled" : "outlined"}
              color="primary"
              onClick={() => toggleFilter(filter)}
              sx={{ mr: 1, mb: 1, fontSize: "10px" }}
            />
          ))}
        </Box>
        <ContextToolbar label="Manage Equipment" contextActions={contextActions} />
        <DataGrid
          sx={{
            borderColor: 'rgba(255, 255, 255, 0.12)',
            fontSize: "12px",
            '& .MuiDataGrid-columnHeaderTitle': {
              fontSize: "11px",
            },
            '& .MuiDataGrid-withBorderColor': {
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }
          }}
          disableRowSelectionOnClick
          checkboxSelection
          autoHeight
          rows={rows}
          columns={columns}
          onRowSelectionModelChange={handleRowSelection}
          rowSelectionModel={selectedRows}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          pageSizeOptions={[]}
        />
      </Box>
    </>
  );
}
