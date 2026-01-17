import { useContext } from "react";
import { FilterContext } from "../../context/FilterContext";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function Sort() {
  const { sort, setSort } = useContext(FilterContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down(400));

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isSmallMobile ? 0.5 : isMobile ? 1 : 1.5,
        width: '100%',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        paddingLeft: isSmallMobile ? '8px' : isMobile ? '12px' : '0',
        paddingRight: isSmallMobile ? '8px' : isMobile ? '12px' : '0'
      }}
    >
      <Typography 
        sx={{ 
          fontSize: isSmallMobile ? '0.65rem' : isMobile ? '0.7rem' : '0.75rem', 
          fontWeight: 700, 
          letterSpacing: isSmallMobile ? '0.3px' : isMobile ? '0.5px' : '1px', 
          color: '#888',
          textTransform: 'uppercase',
          fontFamily: "'Poppins', sans-serif",
          whiteSpace: 'nowrap'
        }}
      >
        Sort By
      </Typography>

      <FormControl 
        variant="standard" 
        sx={{ 
          minWidth: isSmallMobile ? 100 : isMobile ? 120 : 170,
          width: isMobile ? '100%' : 'auto',
          marginRight: isSmallMobile ? '8px' : isMobile ? '12px' : '0',
          marginTop:'10px'
        }}
      >
        <Select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{
            fontSize: isSmallMobile ? "0.75rem" : isMobile ? "0.8rem" : "0.9rem",
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            paddingY: isSmallMobile ? "2px" : "4px",
            paddingLeft: isSmallMobile ? "8px" : "12px",
            "&:before": { borderBottomColor: "#e0e0e0" },
            "&:after": { borderBottomColor: "#000" },
            "& .MuiSelect-select:focus": { backgroundColor: "transparent" },
            width: isMobile ? '100%' : 'auto'
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                maxHeight: 250,
                minWidth: isSmallMobile ? 140 : 180,
                "& .MuiMenuItem-root": {
                  fontSize: isSmallMobile ? "0.75rem" : isMobile ? "0.8rem" : "0.85rem",
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  "&.Mui-selected": { backgroundColor: "#eeeeee" },
                  py: isSmallMobile ? 0.8 : isMobile ? 1 : 1.5
                }
              }
            }
          }}
        >
          <MenuItem value="default">Featured</MenuItem>
          <MenuItem value="lowToHigh">Price: Low to High</MenuItem>
          <MenuItem value="highToLow">Price: High to Low</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export default Sort;