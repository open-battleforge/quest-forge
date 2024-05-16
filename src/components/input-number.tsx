import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Stack, TextField, Button } from "@mui/material";
import { isNil, toNumber } from "lodash";

export const InputNumber = (props: any) => {
  const {
    onChange = () => {},
    value,
    max,
    min,
    style = {},
    defaultValue = 0,
    allowReset,
    disabled = false,
    label,
    fullWidth = false,
    key
  } = props;
  const changeValue = (newValue: number) => {
    if (!isNil(max) && newValue > max) {
      onChange(max);
      return;
    } else if (!isNil(min) && newValue < min) {
      onChange(min);
      return;
    }
    onChange(newValue);
  };
  return (
    <span style={style} key={key ?? label ?? ''}>
      <Stack direction="row">
        {!!allowReset && (
          <Button
            variant="outlined"
            disabled={disabled}
            size="small"
            sx={{ mr: 1, minWidth: 0 }}
            onClick={() => changeValue(defaultValue)}
          >
            <RefreshIcon />
          </Button>
        )}
        <TextField
          fullWidth={fullWidth}
          label={label}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          size="small"
          type="number"
          sx={{ mr: 1 }}
          {...props}
          onChange={(event) => {
            changeValue(toNumber(event.target.value));
          }}
        />
        <Button
          variant="outlined"
          sx={{ mr: 1, minWidth: 0 }}
          disabled={disabled || value === min}
          size="small"
          onClick={() => changeValue(toNumber(value) - 1)}
        >
          <RemoveIcon />
        </Button>
        <Button
          sx={{ minWidth: 0 }}
          variant="outlined"
          disabled={disabled || value === max}
          size="small"
          onClick={() => changeValue(toNumber(value) + 1)}
        >
          <AddIcon />
        </Button>
      </Stack>
    </span>
  );
};