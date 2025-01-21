import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Modal,
  Tab,
  Tabs,
  Typography,
  MenuItem,
  Select,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Papa from "papaparse";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const OrdersPlacedStatisticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("Bengaluru");
  const [openModal, setOpenModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [activeReports, setActiveReports] = useState([]);
  const [inactiveReports, setInactiveReports] = useState([]);
  const [groupingOption, setGroupingOption] = useState("none");
  const [tags, setTags] = useState("");
  const [fileDate, setFileDate] = useState(""); // Store the file date
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#f5f5f5",
    border: "2px solid #3f51b5",
    boxShadow: 24,
    p: 4,
    borderRadius: "8px",
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setSelectedFolder(""); // Clear the selected folder
    setFileDate("");
    setTags(""); // Clear the tags field
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleGroupingChange = (event) => {
    setGroupingOption(event.target.value);
  };

  const handleTagChange = (event) => {
    setTags(event.target.value);
  };

  const handleFileDateChange = (event) => {
    setFileDate(event.target.value); // Update the file date
  };

  const handleFileUpload = (event) => {
    if (
      event.target.files &&
      event.target.files.length > 0 &&
      selectedFolder &&
      fileDate
    ) {
      const files = event.target.files;
      let newData = [];

      Array.from(files).forEach((file) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsedColumns = Object.keys(result.data[0]).map((key) => ({
              field: key,
              headerName: key,
              width: 150,
            }));

            const parsedRows = result.data.map((row, index) => ({
              id: index + 1,
              ...row,
            }));

            newData.push({
              id: Date.now() + Math.random(),
              fileName: file.name,
              rows: parsedRows,
              columns: parsedColumns,
              isActive: true,
              folder: selectedFolder,
              tags: [],
              fileDate, // Add fileDate to the report
            });

            if (newData.length === files.length) {
              setActiveReports((prev) => [...prev, ...newData]);
              setOpenModal(false);
            }
          },
        });
      });
    } else {
      alert("Please select a folder, upload files, and enter a date!");
    }
  };

  const handleToggleActive = (reportId, isActive) => {
    if (isActive) {
      const toggledReport = activeReports.find(
        (report) => report.id === reportId
      );
      if (toggledReport) {
        setActiveReports((prev) =>
          prev.filter((report) => report.id !== reportId)
        );
        setInactiveReports((prev) => [
          ...prev,
          { ...toggledReport, isActive: false },
        ]);
      }
    } else {
      const toggledReport = inactiveReports.find(
        (report) => report.id === reportId
      );
      if (toggledReport) {
        setInactiveReports((prev) =>
          prev.filter((report) => report.id !== reportId)
        );
        setActiveReports((prev) => [
          ...prev,
          { ...toggledReport, isActive: true },
        ]);
      }
    }
  };

  const handleAddTag = (reportId) => {
    setActiveReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? { ...report, tags: [...report.tags, tags] }
          : report
      )
    );
    setTags("");
  };

  const handleRemoveTag = (reportId, tagToRemove) => {
    setActiveReports((prevReports) =>
      prevReports.map((report) =>
        report.id === reportId
          ? {
              ...report,
              tags: report.tags.filter((tag) => tag !== tagToRemove),
            }
          : report
      )
    );
  };

  const groupReports = (reports) => {
    if (groupingOption === "byDate") {
      return reports
        .filter((curr) => curr.folder === activeTab)
        .reduce((groups, report) => {
          const date = report.fileDate || "Unknown Date"; // Group by fileDate
          if (!groups[date]) groups[date] = [];
          groups[date].push(report);
          return groups;
        }, {});
    }

    if (groupingOption === "byTags") {
      return reports
        .filter((curr) => curr.folder === activeTab)
        .reduce((groups, report) => {
          report.tags.forEach((tag) => {
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push(report);
          });
          return groups;
        }, {});
    }

    return { "All Reports": reports };
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "#fafafa",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}>
      <Typography
        variant="h5"
        sx={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "bold",
          color: "#3f51b5",
          mb: 2,
        }}>
        Orders Placed Statistics Dashboard
      </Typography>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleOpenModal}
          sx={{
            backgroundColor: "#3f51b5",
            color: "#fff",
            "&:hover": { backgroundColor: "#283593" },
            fontSize: "13px",
            padding: "8px 16px",
          }}>
          Upload
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab
            label="Bengaluru"
            value="Bengaluru"
            sx={{
              fontSize: "13px",
              backgroundColor:
                activeTab === "Bengaluru" ? "aliceblue" : "transparent",
              "&:hover": {
                backgroundColor:
                  activeTab === "Bengaluru" ? "aliceblue" : "transparent",
              },
            }}
          />
          <Tab
            label="Mumbai"
            value="Mumbai"
            sx={{
              fontSize: "13px",
              backgroundColor:
                activeTab === "Mumbai" ? "aliceblue" : "transparent",
              "&:hover": {
                backgroundColor:
                  activeTab === "Mumbai" ? "aliceblue" : "transparent",
              },
            }}
          />
          <Tab
            label="Delhi"
            value="Delhi"
            sx={{
              fontSize: "13px",
              backgroundColor:
                activeTab === "Delhi" ? "aliceblue" : "transparent",
              "&:hover": {
                backgroundColor:
                  activeTab === "Delhi" ? "aliceblue" : "transparent",
              },
            }}
          />
        </Tabs>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Typography>Group by - </Typography>
        <Select
          value={groupingOption}
          onChange={handleGroupingChange}
          sx={{
            fontSize: "13px",
            width: "200px",
            backgroundColor: "#fff",
            height: "3vh",
            ml: 1,
          }}>
          <MenuItem value="none">All Reports</MenuItem>
          <MenuItem value="byDate">Group by Date</MenuItem>
          <MenuItem value="byTags">Group by Tags</MenuItem>
        </Select>
      </Box>

      {/* Active Reports Accordion */}
      {activeTab !== "inactive" &&
        Object.entries(groupReports(activeReports)).map(([group, reports]) => (
          <Accordion
            key={group}
            sx={{ background: "#fff", mb: 2, background: "aliceblue" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header">
              <Typography>
                {/* Active Reports -{" "}
                {reports.filter((curr) => curr.folder === activeTab).length} */}
                {group === "All Reports" ? "Active Reports" : `${group} `} -{" "}
                {reports.filter((curr) => curr.folder === activeTab).length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ ml: 3, mr: 3 }}>
              {reports
                .filter((curr) => curr.folder === activeTab)
                .map((fileData, index) => (
                  <Box
                    key={index}
                    sx={{ mb: 2, background: "#fff", padding: "0px 10px" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1,
                      }}>
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#3f51b5",
                          fontWeight: "bold",
                        }}>
                        {fileData.fileName}
                        {"  "}
                        <Typography
                          component="span"
                          sx={{
                            color: "red",
                            fontWeight: "normal",
                            fontSize: "13px",
                          }}>
                          {fileData.fileDate}
                        </Typography>
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Switch
                          checked={fileData.isActive}
                          onChange={() =>
                            handleToggleActive(fileData.id, fileData.isActive)
                          }
                          color="primary"
                        />
                        <Typography variant="body2">
                          {fileData.isActive ? "Active" : "Inactive"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <TextField
                        value={tags}
                        onChange={handleTagChange}
                        size="small"
                        sx={{ marginRight: 2 }}
                        placeholder="Add tags"
                      />
                      <Button
                        variant="contained"
                        onClick={() => handleAddTag(fileData.id)}
                        sx={{
                          fontSize: "12px",
                          backgroundColor: "#3f51b5",
                          color: "#fff",
                          "&:hover": { backgroundColor: "#283593" },
                        }}>
                        Add Tag
                      </Button>
                    </Box>

                    <Box sx={{ display: "flex", flexWrap: "wrap", mb: 2 }}>
                      {fileData.tags.map((tag, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            backgroundColor: "#e0dcad",

                            marginRight: "4px",
                            marginBottom: "4px",
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid #d0d0ce",
                            borderRadius: "50px",
                          }}>
                          <Typography
                            variant="body1"
                            sx={{ fontSize: "16px", ml: 2 }}>
                            {tag}
                          </Typography>
                          <Button
                            onClick={() => handleRemoveTag(fileData.id, tag)}
                            sx={{
                              fontSize: "12px",

                              color: "red",
                              justifyContent: "flex-end",
                            }}>
                            X
                          </Button>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        overflowX: "scroll", // Always show horizontal scrollbar
                        "&::-webkit-scrollbar": {
                          height: "8px", // Adjust the height of the horizontal scrollbar
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#3f51b5", // Customize the scrollbar thumb color
                          borderRadius: "4px", // Optional: Add rounded corners to the scrollbar thumb
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "#f0f0f0", // Set the background color for the scrollbar track
                        },
                      }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          minWidth: "800px", // Ensure enough space for columns to trigger scrolling
                        }}>
                        <DataGrid
                          rows={fileData.rows}
                          columns={fileData.columns}
                          initialState={{
                            pagination: {
                              paginationModel: { pageSize: 10, page: 0 },
                            },
                          }}
                          pageSizeOptions={[10, 20, 50, 100, 1000, "All"]}
                          onPageSizeChange={(newPageSize) => {
                            if (newPageSize === "All") {
                              setRowsPerPage(fileData.rows.length); // Set rowsPerPage to the total number of rows if "All" is selected
                            } else {
                              setRowsPerPage(Number(newPageSize)); // Convert string to number and set rowsPerPage
                            }
                          }}
                          sx={{
                            "& .MuiDataGrid-footerContainer": {
                              justifyContent: "flex-start", // Align pagination to the left
                            },
                          }}
                          paginationMode="client"
                        />
                      </Box>
                    </Box>
                  </Box>
                ))}
            </AccordionDetails>
          </Accordion>
        ))}

      {/* Inactive Reports Accordion */}
      <Accordion sx={{ mb: 2 }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header">
          <Typography>Inactive Reports</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {inactiveReports.map((fileData, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}>
                <Typography
                  variant="h6"
                  sx={{ color: "#3f51b5", fontWeight: "bold" }}>
                  {fileData.fileName}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Switch
                    checked={fileData.isActive}
                    onChange={() =>
                      handleToggleActive(fileData.id, fileData.isActive)
                    }
                    color="primary"
                  />{" "}
                  <Typography variant="body2">
                    {fileData.isActive ? "Active" : "Inactive"}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  overflowX: "scroll", // Always show horizontal scrollbar
                  "&::-webkit-scrollbar": {
                    height: "8px", // Adjust the height of the horizontal scrollbar
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#3f51b5", // Customize the scrollbar thumb color
                    borderRadius: "4px", // Optional: Add rounded corners to the scrollbar thumb
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f0f0f0", // Set the background color for the scrollbar track
                  },
                }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    minWidth: "800px", // Ensure enough space for columns to trigger scrolling
                  }}>
                  <DataGrid
                    rows={fileData.rows}
                    columns={fileData.columns}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 10, page: 0 },
                      },
                    }}
                    pageSizeOptions={[10, 20, 50, 100, 1000, "All"]}
                    onPageSizeChange={(newPageSize) => {
                      if (newPageSize === "All") {
                        setRowsPerPage(fileData.rows.length); // Set rowsPerPage to the total number of rows if "All" is selected
                      } else {
                        setRowsPerPage(Number(newPageSize)); // Convert string to number and set rowsPerPage
                      }
                    }}
                    paginationMode="client"
                    sx={{
                      "& .MuiDataGrid-footerContainer": {
                        justifyContent: "flex-start !important", // Align pagination to the left
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </AccordionDetails>
      </Accordion>

      {/* Upload Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={modalStyle}>
          <Typography
            variant="h6"
            sx={{
              fontFamily: "'Roboto', sans-serif",
              fontWeight: "bold",
              color: "#3f51b5",
              mb: 2,
              fontSize: "16px",
            }}>
            Upload CSV Files
          </Typography>
          <Typography sx={{ fontSize: "13px", fontWeight: "500" }}>
            Select the folder:
          </Typography>
          <Select
            value={selectedFolder}
            displayEmpty
            onChange={(e) => setSelectedFolder(e.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2, fontSize: "13px" }}>
            <MenuItem value="" disabled>
              Select City
            </MenuItem>
            <MenuItem value="Bengaluru">Bengaluru</MenuItem>
            <MenuItem value="Mumbai">Mumbai</MenuItem>
            <MenuItem value="Delhi">Delhi</MenuItem>
          </Select>

          {/* New Date Input */}
          <TextField
            label="File Date (dd-mm-yyyy)"
            value={fileDate}
            onChange={handleFileDateChange}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />

          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept=".csv"
            style={{ marginBottom: "10px", width: "100%" }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => setOpenModal(false)}
              sx={{
                fontSize: "13px",
                backgroundColor: "#c6483ebd",
                color: "#fff",
                "&:hover": { backgroundColor: "#e53935" },
                padding: "8px 16px",
                borderRadius: "40px",
              }}>
              Cancel
            </Button>
            <Button
              onClick={handleFileUpload}
              sx={{
                fontSize: "13px",
                backgroundColor: "#3f51b5",
                color: "#fff",
                "&:hover": { backgroundColor: "#283593" },
                padding: "8px 16px",
                borderRadius: "40px",
              }}>
              Upload Files
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default OrdersPlacedStatisticsDashboard;
