
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../states/store";
import { clearErrors } from "../../states/actions";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import {
  MessageBox,
  useTitle,
  MotionDiv,
  CustomTable,
  ViewButton,
  DeleteButton,
} from "../../components";
import reducer from "./state/reducer";
import { getAll, del } from "./state/action";
import { toastOptions } from "../../utils/error";

export default function Transactions() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, transactions, transactionsCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteTransaction = async (id) => {
    await del(dispatch, token, id);
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAll(dispatch, token, curPage, resultPerPage, query)
    }
    fetchData();
  }, [token, curPage, resultPerPage, query]);

  useEffect(() => {
    if (error) {
      toast.error(error, toastOptions);
      clearErrors(dispatch);
    }
  }, [error]);

  const numOfPages = Math.ceil(transactionsCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  // console.log("nuofPage", numOfPages, resultPerPage);

  const column = [
    "S.No",
		"Plan",
		"Amount",
		"Status",
		// "Warranty",
    "Actions"
  ];

  useTitle("Transactions");
  return (
    <MotionDiv>
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <CustomTable
          loading={loading}
          column={column}
          rowNo={resultPerPage}
          rowProps={{ setResultPerPage }}
          paging={numOfPages > 0}
          pageProps={{ numOfPages, curPage }}
          pageHandler={curPageHandler}
          isTitle={true}
          title="Transactions"
          // search={true}
          // searchProps={{ searchInput, setSearchInput, setQuery }}
          // isCreateBtn={true}
          // createBtnProps={{ createURL: "/admin/transaction/create", text: "Transaction" }}
        >
          {transactions &&
            transactions.map((transaction, i) => (
              <tr key={transaction._id} className="odd">
                <td className="text-center">{skip + i + 1}</td>
								<td>{transaction.plan}</td>
								<td>{transaction.amount}</td>
								<td>{transaction.warranty?.status?.value === 'refunded' ? 'refunded' : transaction.status}</td>
								{/* <td>{transaction.warranty}</td> */}
                <td>
                  <ViewButton
                    onClick={() => navigate(`/admin/view/transaction/${transaction._id}`)}
                  />
                  <DeleteButton onClick={() => deleteTransaction(transaction._id)} />
                </td>
              </tr>
            ))}
        </CustomTable>
      )}
      <ToastContainer />
    </MotionDiv>
  );
}
