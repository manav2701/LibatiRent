import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrders, clearErrors, deleteOrder } from "../../actions/orderAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import { DELETE_ORDER_RESET } from "../../constants/orderConstant";
import { makeStyles } from "@material-ui/core/styles";

/**
 * Rebuilt OrderList:
 * - native horizontal scroll wrapper (.pl-native-scroll)
 * - inner container (.pl-table-inner) with computed minWidth from columns
 * - custom scrollbar below with draggable thumb + track click + left/right buttons
 * - robust syncing between native scroll and thumb (RAF-based)
 */

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "1rem",
    margin: 0,
    padding: 0,
    background:
      "linear-gradient(135deg, rgba(237,28,36,0.85) 0%, rgba(60,0,20,0.7) 100%)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    position: "relative",
    overflow: "visible",
  },
  listSidebar: {
    display: "block",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },
  toggleBox: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: "1.5px solid rgba(237,28,36,0.25)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
    backdropFilter: "blur(18px)",
  },
  listTable: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  productListContainer: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: "12px",
    border: "1px solid rgba(237,28,36,0.12)",
    color: "#fff",
    width: "96%",
    height: "fit-content",
    padding: "1rem",
    margin: "0 auto",
    overflow: "visible",
  },
  productListHeading: {
    color: "#fff",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
    fontWeight: 700,
    fontSize: "1.4rem",
    marginBottom: "0.75rem",
  },
  productListTable: {
    background: "transparent",
    borderRadius: "8px",
    color: "#fff",
    width: "100%",
  },
}));

function OrderList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  const [toggle, setToggle] = useState(false);

  const nativeScrollRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  // measurement refs
  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);

  // drag refs
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const thumbStartLeftRef = useRef(0);

  // UI state
  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  const { error, loading, orders = [] } = useSelector((state) => state.allOrders || {});
  const { error: deleteError, isDeleted } = useSelector((state) => state.deleteUpdateOrder || {});

  // toggle handler
  const toggleHandler = () => {
    setToggle(!toggle);
  };

  // close sidebar when width > 999
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  // fetch orders & handle errors/deletes
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success("Order Deleted Successfully");
      history.push("/admin/orders");
      dispatch({ type: DELETE_ORDER_RESET });
    }

    dispatch(getAllOrders());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, deleteError, isDeleted]);

  const deleteOrderHandler = (id) => {
    dispatch(deleteOrder(id));
  };

  // columns definition (include minWidth values)
  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 120, flex: 0.7, headerClassName: "column-header" },
    { field: "availableFromDate", headerName: "Avail. From (Date)", minWidth: 130, flex: 0.5, headerClassName: "column-header hide-on-mobile" },
    { field: "availableFromTime", headerName: "Avail. From (Time)", minWidth: 110, flex: 0.3, headerClassName: "column-header hide-on-mobile" },
    { field: "availableToDate", headerName: "Avail. To (Date)", minWidth: 130, flex: 0.5, headerClassName: "column-header hide-on-mobile" },
    { field: "availableToTime", headerName: "Avail. To (Time)", minWidth: 110, flex: 0.3, headerClassName: "column-header hide-on-mobile" },
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      flex: 0.8,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        const color = params.value === "Delivered" ? "green" : "red";
        return <div style={{ color, fontWeight: 600 }}>{params.value}</div>;
      },
    },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 120, flex: 0.8, headerClassName: "column-header hide-on-mobile" },
    { field: "totalAmount", headerName: "Total Amount", type: "number", minWidth: 140, flex: 0.8, headerClassName: "column-header hide-on-mobile", valueFormatter: (params) => `AED ${params.value}` },
    { field: "amount", headerName: "Amount", type: "number", minWidth: 120, flex: 0.8, headerClassName: "column-header hide-on-mobile" },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1.5,
      sortable: false,
      minWidth: 150,
      headerClassName: "column-header1",
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
              <EditIcon className="icon-" />
            </Link>
            <button
              onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}
              style={{ background: "transparent", border: "none", padding: 0, marginLeft: 8, cursor: "pointer" }}
              aria-label="Delete order"
            >
              <DeleteIcon className="iconbtn" />
            </button>
          </>
        );
      },
    },
  ];

  // build rows
  const rows = [];
  orders &&
    orders.forEach((item) => {
      const availableFromDate = item.availability?.availableFrom?.date
        ? new Date(item.availability.availableFrom.date).toLocaleDateString("en-GB")
        : "";
      const availableFromTime = item.availability?.availableFrom?.time || "";
      const availableToDate = item.availability?.availableTo?.date
        ? new Date(item.availability.availableTo.date).toLocaleDateString("en-GB")
        : "";
      const availableToTime = item.availability?.availableTo?.time || "";

      rows.push({
        id: item._id,
        availableFromDate,
        availableFromTime,
        availableToDate,
        availableToTime,
        itemsQty: item.orderItems?.length || 0,
        amount: item.totalPrice,
        totalAmount: item.totalPrice,
        status: item.orderStatus,
      });
    });

  // compute total min width from columns so overflow will happen when needed
  const totalMinWidth = columns.reduce((acc, c) => acc + (c.minWidth || 100), 0) + 64;

  // measurement updater
  const updateMeasurements = useCallback(() => {
    const native = nativeScrollRef.current;
    const track = trackRef.current;
    if (!native || !track) return;

    const visibleW = native.clientWidth;
    const scrollW = Math.max(native.scrollWidth || visibleW, visibleW);
    const trackW = track.clientWidth || 0;

    const ratio = visibleW / scrollW;
    const minThumb = 36;
    const thumbW = Math.max(minThumb, Math.floor(trackW * ratio));

    setTrackWidth(trackW);
    setThumbWidth(thumbW);
    trackWidthRef.current = trackW;
    thumbWidthRef.current = thumbW;

    const maxScrollLeft = Math.max(1, scrollW - visibleW);
    const maxThumbLeft = Math.max(1, trackW - thumbW);
    const left = (native.scrollLeft / maxScrollLeft) * maxThumbLeft || 0;
    setThumbLeft(left);
  }, []);

  // sync thumb to native scroll
  const syncThumbToScroll = useCallback(() => {
    const native = nativeScrollRef.current;
    if (!native) return;
    const scrollW = native.scrollWidth;
    const visibleW = native.clientWidth;
    const maxScrollLeft = Math.max(1, scrollW - visibleW);
    const maxThumbLeft = Math.max(1, trackWidthRef.current - thumbWidthRef.current);
    const left = (native.scrollLeft / maxScrollLeft) * maxThumbLeft || 0;
    setThumbLeft(left);
  }, []);

  // RAF-based native scroll handler
  const onNativeScroll = useCallback(() => {
    requestAnimationFrame(syncThumbToScroll);
  }, [syncThumbToScroll]);

  // track click to jump
  const onTrackClick = (e) => {
    if (!trackRef.current || !nativeScrollRef.current) return;
    if (e.target === thumbRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newThumbLeft = Math.max(0, Math.min(trackWidthRef.current - thumbWidthRef.current, clickX - thumbWidthRef.current / 2));
    setThumbLeft(newThumbLeft);

    const native = nativeScrollRef.current;
    const scrollW = native.scrollWidth;
    const visibleW = native.clientWidth;
    const maxThumbLeft = Math.max(1, trackWidthRef.current - thumbWidthRef.current);
    const maxScrollLeft = Math.max(1, scrollW - visibleW);
    const newScrollLeft = (newThumbLeft / maxThumbLeft) * maxScrollLeft;
    native.scrollTo({ left: newScrollLeft, behavior: "smooth" });

    // keep syncing while smooth scroll animates
    const loop = () => {
      syncThumbToScroll();
      if (Math.abs(native.scrollLeft - newScrollLeft) > 0.5) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  };

  // pointerdown on thumb: attach pointermove/pointerup handlers here for reliable dragging
  const onThumbPointerDown = (e) => {
    e.preventDefault();
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    thumbStartLeftRef.current = thumbLeft;
    document.body.style.userSelect = "none";

    try {
      e.target.setPointerCapture?.(e.pointerId);
    } catch (err) {}

    const onMove = (ev) => {
      if (!draggingRef.current) return;
      ev.preventDefault();
      const deltaX = ev.clientX - dragStartXRef.current;
      const newThumbLeft = Math.max(0, Math.min(trackWidthRef.current - thumbWidthRef.current, thumbStartLeftRef.current + deltaX));
      setThumbLeft(newThumbLeft);

      // sync native scrollLeft
      const native = nativeScrollRef.current;
      if (!native) return;
      const scrollW = native.scrollWidth;
      const visibleW = native.clientWidth;
      const maxThumbLeft = Math.max(1, trackWidthRef.current - thumbWidthRef.current);
      const maxScrollLeft = Math.max(1, scrollW - visibleW);
      const newScrollLeft = (newThumbLeft / maxThumbLeft) * maxScrollLeft;
      native.scrollLeft = newScrollLeft;
    };

    const onUp = (ev) => {
      draggingRef.current = false;
      document.body.style.userSelect = "";
      try {
        thumbRef.current?.releasePointerCapture?.(e.pointerId);
      } catch (err) {}
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { passive: true });
  };

  // scrollByDelta with RAF sync loop
  const scrollByDelta = (delta) => {
    const native = nativeScrollRef.current;
    if (!native) return;
    native.scrollBy({ left: delta, behavior: "smooth" });

    let last = native.scrollLeft;
    const loop = () => {
      syncThumbToScroll();
      const cur = native.scrollLeft;
      if (Math.abs(cur - last) > 0.5) {
        last = cur;
        requestAnimationFrame(loop);
      } else {
        syncThumbToScroll();
      }
    };
    requestAnimationFrame(loop);
  };

  // setup listeners & resize observer
  useEffect(() => {
    updateMeasurements();
    const native = nativeScrollRef.current;
    if (!native) return;

    native.addEventListener("scroll", onNativeScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      updateMeasurements();
    });
    if (trackRef.current) ro.observe(trackRef.current);
    if (nativeScrollRef.current) ro.observe(nativeScrollRef.current);

    window.addEventListener("resize", updateMeasurements);

    return () => {
      native.removeEventListener("scroll", onNativeScroll);
      ro.disconnect();
      window.removeEventListener("resize", updateMeasurements);
    };
  }, [updateMeasurements, onNativeScroll]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`ALL Orders - Admin`} />
          <div className={classes.root}>
            <div className={!toggle ? classes.listSidebar : classes.toggleBox}>
              <Sidebar />
            </div>

            <div className={classes.listTable}>
              <Navbar toggleHandler={toggleHandler} />
              <div className={classes.productListContainer}>
                <h4 className={classes.productListHeading}>ALL ORDERS</h4>

                {/* Native horizontal scroll area */}
                <div
                  className="pl-native-scroll"
                  ref={nativeScrollRef}
                  aria-label="Orders horizontal scroll area"
                >
                  <div
                    className="pl-table-inner"
                    style={{ minWidth: totalMinWidth }}
                  >
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableSelectionOnClick
                      className={classes.productListTable}
                      autoHeight
                    />
                  </div>
                </div>

                {/* Custom scrollbar */}
                <div className="pl-custom-scrollbar" aria-hidden={false}>
                  <button
                    className="pl-scroll-btn pl-scroll-left"
                    onClick={() =>
                      scrollByDelta(-Math.floor((nativeScrollRef.current?.clientWidth || 600) * 0.8))
                    }
                    aria-label="Scroll left"
                  >
                    ◀
                  </button>

                  <div
                    className="pl-scroll-track"
                    ref={trackRef}
                    onClick={onTrackClick}
                    role="presentation"
                  >
                    <div
                      className="pl-scroll-thumb"
                      ref={thumbRef}
                      onPointerDown={onThumbPointerDown}
                      style={{
                        width: `${thumbWidthRef.current || thumbWidth}px`,
                        transform: `translateX(${thumbLeft}px)`,
                      }}
                    />
                  </div>

                  <button
                    className="pl-scroll-btn pl-scroll-right"
                    onClick={() =>
                      scrollByDelta(Math.floor((nativeScrollRef.current?.clientWidth || 600) * 0.8))
                    }
                    aria-label="Scroll right"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default OrderList;
