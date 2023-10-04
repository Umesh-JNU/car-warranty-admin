import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { Form, Container, Card, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../states/store";
// icons
import { BiSolidShieldX } from "react-icons/bi";
import { HiShieldCheck, HiShieldExclamation } from "react-icons/hi";
import { GiNetworkBars } from "react-icons/gi";
import { FaArrowCircleRight } from "react-icons/fa";
import { IoIosPerson, IoIosPersonAdd, IoMdPie } from "react-icons/io";

import Chart from "react-google-charts";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "../utils/axiosUtil";
import { getError } from "../utils/error";
import { MotionDiv, MessageBox } from "../components";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        sale: action.payload.sales,
        refund: action.payload.refund,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const ChartCard = ({ type }) => {
  const [{ loading, sale, refund, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  // const {sale, refund} = summary && summary;
  const data = type === 'Sales' ? sale : refund;

  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("month");
  const [timeType, setTimeType] = useState();
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentDate = new Date();
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const monthlySales = (data) => {
    const months = [
      ['Jan', 0],
      ['Feb', 0],
      ['Mar', 0],
      ['Apr', 0],
      ['May', 0],
      ['Jun', 0],
      ['Jul', 0],
      ['Aug', 0],
      ['Sept', 0],
      ['Oct', 0],
      ['Nov', 0],
      ['Dec', 0],
    ];

    data.forEach((x) => {
      console.log({ x });
      if (x.month) months[x.month - 1][1] = x.totalSales;
    });
    console.log({ months });
    return months;
  };

  const weeklySales = (data) => {
    const weeks = [
      ['Week 1', 0],
      ['Week 2', 0],
      ['Week 3', 0],
      ['Week 4', 0]
    ];

    data.forEach((x) => {
      console.log({ x });
      if (x.week) weeks[x.week - 1][1] = x.totalSales;
    });
    console.log({ weeks });
    return weeks;
  };

  useEffect(() => {
    setTimeType(time === 'month' ? currentMonth : currentYear);
  }, [time]);

  useEffect(() => {
    console.log({ time });
    (async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axiosInstance.get(
          `/api/admin/statistics/${time}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log({ data })
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    })();
  }, [token, time]);

  return (
    <div>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card className="mb-3">
          <Card.Header className="card-header-primary">
            {type === 'Sales' ? 'Sales Report' : 'Refund Report'}
          </Card.Header>
          <Card.Body className="p-0">
            {loading ? (
              <Skeleton count={5} height={30} />
            ) : data.length === 0 ? (
              <MessageBox>{type === 'Sales' ? 'No Sales' : 'No Refund'}</MessageBox>
            ) : (
              <>
                {time === "month" ?
                  <Chart
                    style={{ overflow: "hidden" }}
                    width="100%"
                    height="400px"
                    chartType="ColumnChart"
                    options={{
                      series: {
                        0: { bar: { groupWidth: '50%' } }, // Set the bar width to 50%
                      },
                      hAxis: { title: "Weeks" }, // X-axis label
                      vAxis: { title: `Total ${type}` }, // Y-axis label
                      colors: ["#00ab41"],
                    }}
                    data={[
                      ["Weeks", `Total ${type} (${timeType})`],
                      ...weeklySales(data),
                    ]}
                  ></Chart> :
                  <Chart
                    style={{ overflow: "hidden", top: 0 }}
                    width="100%"
                    height="400px"
                    chartType="ColumnChart"
                    options={{
                      hAxis: { slantedText: true, slantedTextAngle: 45, title: "Months" }, // X-axis label
                      vAxis: { title: `Total ${type}` }, // Y-axis label
                      colors: ["#00ab41"],
                    }}
                    data={[
                      ["Month", `Total ${type} (${timeType})`],
                      ...monthlySales(data)
                    ]}
                  ></Chart>
                }
                <div className="f-center graph-filter">
                  <Form.Group>
                    {/* {time==='month' && <p>{new Date().getMonth()}</p>} */}
                    <Form.Check
                      inline
                      label="Month"
                      type="radio"
                      checked={time === "month"}
                      // name="filterOption"
                      // value="month"
                      onChange={(e) => { e.preventDefault(); setTime("month"); }}
                    />

                    <Form.Check
                      inline
                      label="Year"
                      type="radio"
                      checked={time === "year"}
                      // name="filterOption"
                      // value="year"
                      onChange={(e) => { e.preventDefault(); setTime("year"); }}
                    />
                  </Form.Group>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  )
};

export default function Dashboard() {
  return (
    <MotionDiv>
      <Row
        className="my-3 pb-2"
        style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
      >
        <Col md={6}>
          <h3>InSights</h3>
        </Col>
        <Col md={6}>
          {/* <div className="float-md-end d-flex align-items-center">
                <p className="p-bold m-0 me-3">InSights For</p>
                <Form.Group controlId="time">
                  <Form.Select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                    }}
                    aria-label="Default select example"
                  >
                    <option key="blankChoice" hidden value>
                      Select Time
                    </option>
                    <option value="all">All Time Statistics</option>
                    <option value="daily">Daily Statistics</option>
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </Form.Select>
                </Form.Group>
              </div> */}
        </Col>
      </Row>

      <Container className="container-md">
        <ChartCard type="Sales" />
        <ChartCard type="Refund" />
      </Container>

      <ToastContainer />
    </MotionDiv >
  );
}
