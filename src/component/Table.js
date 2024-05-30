import React from "react";
import { CSVLink, CSVDownload } from "react-csv";
import "./table.scss";

const GetPaginationButtons = (props) => {
  var childs = [];
  for (var i = 0; i < props.totalRecords / props.recordPerPage; i++) {
    if (
      (i >= props.currentActiveButton && i < props.currentActiveButton + 3) ||
      i > props.totalRecords / props.recordPerPage - 3
    ) {
      var item = { value: i + 1, key: i };
      childs.push(item);
    } else if (i == props.currentActiveButton + 4) {
      var item = { value: "...", key: i };
      childs.push(item);
    }
    if (
      childs.findIndex((a) => a.value == 1) < 0 &&
      childs.findIndex((a) => a.value == "...") != 0
    ) {
      item = { value: "...", key: i };
      childs.unshift(item);
    }
  }
  return childs.map((item) => (
    <button
      key={item.key}
      className={`pagination-btn ${item.value == "..." ? "transparent " : ""} ${item.value == props.currentActiveButton + 1 ? "active" : ""
        }`}
      onClick={() => props.handlePaginationButtonClick(item.value)}
    >
      {item.value}
    </button>
  ));
};

let currentStartingValue = 0;
let isSortedAsscending = true;

class Table extends React.Component {
  state = {
    filteredData: [],
    noOfRecordPerPage: 10,
    listItemToPrint: [],
    onPagination: true,
  };
  componentDidMount = () => {
    this.displayCurrentPageRecord(0, 10);
    const listItemToPrint = this.props.data.map((item) => {
      return this.props.listItemToDisplay.map((nes) => item[nes.valueField]);
    });
    this.setState({
      listItemToPrint,
    });
    if (this.props.data.length <= 10) {
      this.setState({ onPagination: false });
    }
  };
  //lifecycle
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.data !== this.props.data) {
      const listItemToPrint = this.props.data.map((item) => {
        return this.props.listItemToDisplay.map((nes) => item[nes.valueField]);
      });
      this.setState({
        listItemToPrint,
      });
      this.displayCurrentPageRecord(0, 10);
    }
    if (prevProps.data.length !== this.props.data.length) {
      if (this.props.data.length <= 10) {
        this.setState({ onPagination: false });
      }
    }
  }
  //Pagination
  handlePaginationButtonClick = (i) => {
    this.displayCurrentPageRecord(i - 1);
  };
  displayCurrentPageRecord = (startFrom, noOfRecordPerPageValue) => {
    let noOfRecordPerPageVal;
    if (noOfRecordPerPageValue != undefined) {
      noOfRecordPerPageVal = noOfRecordPerPageValue;
    } else {
      const { noOfRecordPerPage } = this.state;
      noOfRecordPerPageVal = noOfRecordPerPage;
    }
    currentStartingValue = startFrom;
    var items = this.props.data.slice(
      startFrom * noOfRecordPerPageVal,
      +noOfRecordPerPageVal + startFrom * +noOfRecordPerPageVal
    );
    this.setState({
      filteredData: items,
    });
  };
  handleNextBtnClick = () => {
    const { noOfRecordPerPage } = this.state;
    if (
      currentStartingValue * noOfRecordPerPage + noOfRecordPerPage >=
      this.props.data.length
    ) {
      return;
    }
    this.displayCurrentPageRecord(currentStartingValue + 1);
  };
  handlePreviousBtnClick = () => {
    if (currentStartingValue < 1) {
      return;
    }
    this.displayCurrentPageRecord(currentStartingValue - 1);
  };

  //Sorting
  handleSorting = (sortBy) => {
    const { filteredData } = this.state;
    let sortingCurrentSuperAdmin;
    if (!isSortedAsscending) {
      sortingCurrentSuperAdmin = filteredData.sort((a, b) =>
        a[sortBy].toString().localeCompare(b[sortBy])
      );
      isSortedAsscending = true;
    } else {
      sortingCurrentSuperAdmin = filteredData.sort((a, b) =>
        b[sortBy].toString().localeCompare(a[sortBy])
      );
      isSortedAsscending = false;
    }
    this.setState({
      filteredData: sortingCurrentSuperAdmin,
    });
  };
  handleNoOfRecordPerPageChange = (event) => {
    this.setState({
      noOfRecordPerPage: event.target.value,
    });
    this.displayCurrentPageRecord(
      event.target.value - event.target.value,
      event.target.value
    );
  };
  render() {
    const {
      listItemToDisplay,
      buttonsToDisplay,
      onTableButtonClick,
      data,
      noOfRecordsPerPageOptions = [5, 10, 20, 50],
      isCheckOption = false,
      onCheckOptionToggle,
      allChecked = false,
    } = this.props;
    const { noOfRecordPerPage, onPagination } = this.state;
    return (
      <div className="table-wrapper">
        <table className="table">
          <thead className="table-head">
            <tr>
              {isCheckOption && (
                <th>
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onClick={() => onCheckOptionToggle(null)}
                  />
                </th>
              )}
              {listItemToDisplay.map((item) => (
                <th
                  key={item.name}
                  onClick={() => this.handleSorting(item.valueField)}
                >
                  {item.name}
                </th>
              ))}
              {buttonsToDisplay &&
                buttonsToDisplay.map((item) => (
                  <th key={item.name} className="img-btn-header">
                    {item.name}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="table-body">
            {this.state.filteredData.map((item, index) => (
              <tr key={index}>
                {isCheckOption && (
                  <td>
                    <input
                      type="checkbox"
                      checked={item.Checked}
                      onClick={() => onCheckOptionToggle(item)}
                    />
                  </td>
                )}
                {listItemToDisplay.map((nes, index) => (
                  <td key={index} data-label={nes.name}>{`${item[nes.valueField]
                    }`}</td>
                ))}
                {/* {buttonsToDisplay &&
                  buttonsToDisplay.map((btn, index) => (
                    <td key={index} className="img-btn-col">
                      <img
                        alt="btn"
                      
                        onClick={() => onTableButtonClick(item, btn.name)}
                        className={`td-img-btn ${"fa fa-eye"}`}
                      ></img>
                    </td>
                  ))} */}
                {buttonsToDisplay &&
                  buttonsToDisplay.map((btn, index) => (
                    <td key={index} className="img-btn-col">
                      <a
                        btn
                        style={
                          btn.color === undefined
                            ? { color: "#0094e6" }
                            : { color: `${btn.color}` }
                        }
                        alt="btn"
                        onClick={() =>
                          onTableButtonClick(item, btn.name)
                        }
                        className={`td-img-btn ${btn.imgClass}`}
                      ></a>
                    </td>
                  ))}

              </tr>
            ))}
          </tbody>
        </table>
        {onPagination ? (
          <div className="pagination-wrapper">
            <button onClick={this.handlePreviousBtnClick}>Prev</button>
            {
              <GetPaginationButtons
                totalRecords={data.length}
                recordPerPage={noOfRecordPerPage}
                handlePaginationButtonClick={this.handlePaginationButtonClick}
                currentActiveButton={currentStartingValue}
              />
            }
            <button onClick={this.handleNextBtnClick}>Next</button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Table;
