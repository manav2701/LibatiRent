import React, { useState, useEffect, useRef, useCallback } from "react";
import "./ProductList.css";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layouts/MataData/MataData";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Sidebar from "./Siderbar";
import Navbar from "./Navbar";
import Loader from "../layouts/loader/Loader";
import {
  getAllUsers,
  clearErrors,
  deleteUser,
} from "../../actions/userAction";
import { DELETE_USER_RESET } from "../../constants/userConstanat";
import { makeStyles } from "@material-ui/core/styles";

/**
 * Revamped UserList
 * - Native scroll wrapper + custom scrollbar (draggable thumb, track click, arrows)
 * - Computes total minWidth from columns' minWidth values
 * - Robust sync between native scroll and custom thumb (RAF + pointer events)
 * - Keeps original Redux flow (fetch, delete, clear errors)
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
  container: {
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
  heading: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.4rem",
    marginBottom: "0.75rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
  },
  gridStyle: {
    width: "100%",
  },
}));

export default function UserList() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const alert = useAlert();
  const history = useHistory();

  // Redux state
  const { error, users = [], loading } = useSelector((state) => state.allUsers || {});
  const { error: deleteError, isDeleted, message } = useSelector(
    (state) => state.profileData || {}
  );

  // UI toggles
  const [toggle, setToggle] = useState(false);

  // Custom scrollbar refs/state
  const nativeScrollRef = useRef(null);
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const trackWidthRef = useRef(0);
  const thumbWidthRef = useRef(0);

  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const thumbStartLeftRef = useRef(0);

  const [thumbLeft, setThumbLeft] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);

  useEffect(() => {
    // display errors / success messages and fetch users
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }
    if (isDeleted) {
      alert.success(message || "User deleted");
      history.push("/admin/users");
      dispatch({ type: DELETE_USER_RESET });
    }

    dispatch(getAllUsers());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, error, deleteError, isDeleted, message]);

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  // close sidebar when screen > 999px
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) setToggle(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  // Datagrid columns
  const columns = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 150,
      flex: 0.5,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "email",
      headerName: "Email",
      minWidth: 200,
      flex: 0.8,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 150,
      flex: 0.4,
      headerClassName: "column-header hide-on-mobile",
      cellClassName: (params) =>
        params.getValue(params.id, "role") === "admin" ? "greenColor" : "redColor",
    },
    {
      field: "id",
      headerName: "User ID",
      minWidth: 220,
      flex: 0.8,
      sortable: false,
      headerClassName: "column-header hide-on-mobile",
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0.6,
      sortable: false,
      headerClassName: "column-header hide-on-mobile",
      renderCell: (params) => {
        return (
          <>
            <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
              <EditIcon className="icon-" />
            </Link>

            <Button
              onClick={() => deleteUserHandler(params.getValue(params.id, "id"))}
              style={{ marginLeft: 8 }}
            >
              <DeleteIcon className="iconbtn" />
            </Button>
          </>
        );
      },
    },
  ];

  // rows
  const rows = [];
  users &&
    users.forEach((item) => {
      rows.push({
        id: item._id,
        role: item.role,
        email: item.email,
        name: item.name,
      });
    });

  // compute inner minWidth from columns to force overflow when needed
  const totalMinWidth = columns.reduce((acc, c) => acc + (c.minWidth || 100), 0) + 64;

  // measurement & sync helpers
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

  const onNativeScroll = useCallback(() => {
    requestAnimationFrame(syncThumbToScroll);
  }, [syncThumbToScroll]);

  const onTrackClick = (e) => {
    if (!trackRef.current || !nativeScrollRef.current) return;
    if (e.target === thumbRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newThumbLeft = Math.max(
      0,
      Math.min(trackWidthRef.current - thumbWidthRef.current, clickX - thumbWidthRef.current / 2)
    );
    setThumbLeft(newThumbLeft);

    const native = nativeScrollRef.current;
    const scrollW = native.scrollWidth;
    const visibleW = native.clientWidth;
    const maxThumbLeft = Math.max(1, trackWidthRef.current - thumbWidthRef.current);
    const maxScrollLeft = Math.max(1, scrollW - visibleW);
    const newScrollLeft = (newThumbLeft / maxThumbLeft) * maxScrollLeft;
    native.scrollTo({ left: newScrollLeft, behavior: "smooth" });

    // sync while smooth scroll animates
    const loop = () => {
      syncThumbToScroll();
      if (Math.abs(native.scrollLeft - newScrollLeft) > 0.5) {
        requestAnimationFrame(loop);
      }
    };
    requestAnimationFrame(loop);
  };

  // attach pointermove/pointerup inside pointerdown to guarantee capture
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
      const newThumbLeft = Math.max(
        0,
        Math.min(trackWidthRef.current - thumbWidthRef.current, thumbStartLeftRef.current + deltaX)
      );
      setThumbLeft(newThumbLeft);

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

  const scrollByDelta = (delta) => {
    const native = nativeScrollRef.current;
    if (!native) return;
    native.scrollBy({ left: delta, behavior: "smooth" });

    // RAF loop to keep thumb in sync during smooth scroll
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

  // setup listeners & observers
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

  const toggleHandler = () => setToggle(!toggle);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`ALL Users - Admin`} />
          <div className={classes.root}>
            <div className={!toggle ? classes.listSidebar : classes.toggleBox}>
              <Sidebar />
            </div>

            <div className={classes.listTable}>
              <Navbar toggleHandler={toggleHandler} />

              <div className={classes.container}>
                <h4 className={classes.heading}>ALL USERS</h4>

                {/* Native horizontal scroll container */}
                <div className="pl-native-scroll" ref={nativeScrollRef} aria-label="Users horizontal scroll area">
                  <div className="pl-table-inner" style={{ minWidth: totalMinWidth }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={10}
                      disableSelectionOnClick
                      className="productListTable"
                      autoHeight
                    />
                  </div>
                </div>

                {/* Custom scrollbar */}
                <div className="pl-custom-scrollbar" aria-hidden={false}>
                  <button
                    className="pl-scroll-btn pl-scroll-left"
                    onClick={() => scrollByDelta(-Math.floor((nativeScrollRef.current?.clientWidth || 600) * 0.8))}
                    aria-label="Scroll left"
                  >
                    ◀
                  </button>

                  <div className="pl-scroll-track" ref={trackRef} onClick={onTrackClick} role="presentation">
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
                    onClick={() => scrollByDelta(Math.floor((nativeScrollRef.current?.clientWidth || 600) * 0.8))}
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
