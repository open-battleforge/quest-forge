import {
  Box,
  Checkbox,
  Stack,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import {
  getItemsFromIds, isEquippable,
} from "utils/data";
import Chip from "@mui/material/Chip";
import { intersection } from "lodash";
import {
  DataGrid,
  GridColDef,
  GridRowsProp,
  gridStringOrNumberComparator,
} from "@mui/x-data-grid";
import Show from "components/show";

export const Equipment = (props: any) => {
  const { character, setCharacter } = props;
  const [activeFilters, setActiveFilters] = useState(new Set());
  const filters = ["Armor", "Weapon", "Gear", "Spell"];
  const toggleFilter = (filter: any) => {
    if (activeFilters.has(filter)) {
      activeFilters.delete(filter);
    } else {
      activeFilters.add(filter);
    }
    setActiveFilters(new Set(activeFilters));
  };
  const toggleItem = (itemIndex: number) => {
    setCharacter({
      ...character,
      inventory: character?.inventory?.map((item: any, index: number) =>
        itemIndex === index ? { ...item, active: !item?.active } : item
      ),
    });
  };
  const nameSortComparator = (v1: any, v2: any, param1: any, param2: any) => {
    return gridStringOrNumberComparator(v1.name, v2.name, param1, param2);
  };
  const inventory = getItemsFromIds(
    character?.inventory || [].map((item: any) => item?.id)
  ).map((item: any, index: number) => ({
    ...item,
    count: character?.inventory?.[index]?.count,
    index: index,
  }));
  const inventoryFiltered = inventory.filter((equip: any) => {
    const activeFiltersArr = Array.from(activeFilters);
    return (
      intersection(activeFiltersArr, equip.keywords).length || !activeFiltersArr.length
    );
  });
  const columns: GridColDef[] = [
    {
      field: "active",
      headerName: "Active",
      renderCell: (params: any) => (
        <>
          <Show when={params?.row?.canEquip}>
            <Checkbox
              checked={params?.value}
              onChange={() => {
                toggleItem(params?.row?.id);
              }}
            />
          </Show>
          <Show when={!params?.row?.canEquip}>
            <Box alignItems="center" justifyContent="center">
              -
            </Box>
          </Show>
        </>
      ),
      sortComparator: nameSortComparator,
      width: 60,
      flex: 0,
      align: 'center'
    },
    {
      field: "value",
      headerName: "Name",
      renderCell: (params: any) => (
        <Stack>
          <Typography fontSize="13px">
            {params?.value?.name}{" "}
            {params?.value?.count > 1 ? `(${params?.value?.count})` : ""}
          </Typography>
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
  const rows: GridRowsProp = inventoryFiltered.map((item: any) => ({
    id: item.index,
    active: !!character?.inventory?.[item.index]?.active,
    value: item,
    col2: item?.cost,
    weight: item.weight,
    count: character?.inventory?.[item.index]?.count,
    canEquip: isEquippable(item)
  }));
  return (
    <>
      <Box>
        {filters.map((filter, index) => (
          <Chip
            key={index}
            label={filter}
            variant={activeFilters.has(filter) ? "filled" : "outlined"}
            color="primary"
            onClick={() => toggleFilter(filter)}
            sx={{ mr: 1, mb: 1, fontSize: "10px" }}
          />
        ))}
      </Box>
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
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { pageSize: 25, page: 0 },
          },
        }}
        pageSizeOptions={[]}
        rows={rows}
        columns={columns}
      />
    </>
  );
};