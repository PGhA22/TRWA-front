import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import iconDashboard from "../assets/icons/dashboard.svg";
import iconCourse from "../assets/icons/course.svg";
import iconChallenge from "../assets/icons/target.svg";
import iconGroup from "../assets/icons/group.svg";
import iconLive from "../assets/icons/live.svg";
import iconChat from "../assets/icons/chat.svg";
import iconResource from "../assets/icons/resource.svg";
import iconVip from "../assets/icons/vip.svg";
import iconFaq from "../assets/icons/faq.svg";
import iconStore from "../assets/icons/store.svg";
import "../style.css";
import bgVip from "../assets/images/bg-vip.webp";
import supportIcon from "../assets/images/support.webp";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = useMemo(
    () => [
      {
        type: "link",
        label: "Dashboard",
        icon: iconDashboard,
        to: "/Dashboard",
      },
      {
        type: "panel",
        label: "Courses",
        icon: iconCourse,
        to: "/Courses",
        content: (
          <div className="text-white space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>My Courses</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Continue Watching</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>All Courses</Link>
            </div>
          </div>
        ),
      },
      {
        type: "panel",
        label: "Challenges",
        icon: iconChallenge,
        content: (
          <div className="text-white space-y-4 text-nowrap">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Available Challenges</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>My Challenges</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Submissions</Link>
            </div>
          </div>
        ),
      },
      {
        type: "panel",
        label: "Groups",
        icon: iconGroup,
        content: (
          <div className="text-white space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>My Groups</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Discover Groups</Link>
            </div>
          </div>
        ),
      },
      {
        type: "panel",
        label: "Live & Events",
        icon: iconLive,
        content: (
          <div className="text-white space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Upcoming</Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <Link to={"/Dashboard"}>Past Events</Link>
            </div>
          </div>
        ),
      },
      { type: "link", label: "Chat Room", icon: iconChat, to: "/Dashboard" },
      {
        type: "link",
        label: "VIP CLUB",
        icon: iconVip,
        to: "/Dashboard",
        variant: "vip",
      },
      { type: "link", label: "Resources", icon: iconResource, to: "/Dashboard" },
      { type: "link", label: "FAQ", icon: iconFaq, to: "/Dashboard" },
      { type: "link", label: "Store", icon: iconStore, to: "/Dashboard" },
    ],
    [],
  );

  const [activeIndex, setActiveIndex] = useState(null);
  const [panelTop, setPanelTop] = useState(0);
  const [panelHeight, setPanelHeight] = useState(0);
  const [disableMoveAnim, setDisableMoveAnim] = useState(false);
  const [opening, setOpening] = useState(false);

  const menuRef = useRef(null);
  const panelRef = useRef(null);
  const spacerRef = useRef(null);

  useLayoutEffect(() => {
    if (activeIndex === null) return;

    const activeItem = items[activeIndex];
    if (!activeItem || activeItem.type !== "panel") return;

    const menuEl = menuRef.current;
    const spacerEl = spacerRef.current;
    const panelEl = panelRef.current;
    if (!menuEl || !spacerEl || !panelEl) return;

    const menuRect = menuEl.getBoundingClientRect();
    const spacerRect = spacerEl.getBoundingClientRect();
    const panelRect = panelEl.getBoundingClientRect();

    setPanelHeight(panelRect.height);

    const scrollTop = menuEl.scrollTop || 0;
    setPanelTop(spacerRect.top - menuRect.top + scrollTop);

    requestAnimationFrame(() => {
      setDisableMoveAnim(false);
      setOpening(false);
    });
  }, [activeIndex, items]);

  const closePanel = () => {
    setActiveIndex(null);
    setOpening(false);
    setDisableMoveAnim(false);
  };

  const handleItemClick = (item, index) => {
    if (item.type === "link") {
      closePanel();
      navigate(item.to);
      return;
    }

    if (activeIndex === index) {
      closePanel();
      return;
    }

    if (activeIndex === null) {
      setDisableMoveAnim(true);
      setOpening(true);
      setActiveIndex(index);
      return;
    }

    setActiveIndex(index);
  };

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const showPanel = activeItem?.type === "panel";

  return (
    <div className="flex min-h-screen relative">
      <div className="fixed w-13 h-13 z-50 right-15 bottom-9">
        <img
          src={supportIcon}
          alt="support"
          className="w-full h-full object-contain"
        />
        <Link
          to="/Support"
          className="bg-transparent h-full w-full absolute inset-0 rounded-full"
        ></Link>
      </div>
      <div className="w-19/120"></div>
      <aside className="fixed h-screen w-19/120 border-r border-white/25 bg-(image:--bg-prim) bg-cover">
        <div>
          <img src="/trwa_logo.png" alt="trwa_logo" className="w-51/76 -mt-2" />
        </div>

        <div
          ref={menuRef}
          className="relative flex flex-col gap-5 2xl:gap-6 px-5 2xl:px-7 overflow-y-auto"
        >
          {items.map((item, index) => {
            const isRouteActive =
              item.to &&
              pathname.toLowerCase().startsWith(item.to.toLowerCase());
            const isPanelActive =
              item.type === "panel" && (activeIndex === index || isRouteActive);
            const isActive =
              (item.type === "link" && isRouteActive) || isPanelActive;

            return (
              <div key={index} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleItemClick(item, index)}
                  className={`
                    relative z-30 font-semibold 
                    ${isActive ? "dashboardBtnActive h-10" : "h-10"}
                    py-2.5 px-4 2xl:px-9 rounded-2xl flex gap-1.5 2xl:gap-3.5 items-center w-full whitespace-nowrap
                    ${
                      item.variant === "vip"
                        ? `bg-cover bg-center`
                        : "shadow-[inset_0px_0px_30px_2px_#245797]"
                    }
                  `}
                  style={
                    item.variant === "vip"
                      ? {
                          backgroundImage: `url(${bgVip})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : undefined
                  }
                >
                  <img src={item.icon} alt="icon" className="w-5 2xl:w-5.5" />
                  {item.label}
                </button>

                {item.type === "panel" && activeIndex === index && (
                  <div ref={spacerRef} style={{ height: panelHeight }} />
                )}
              </div>
            );
          })}

          {showPanel && (
            <div
              ref={panelRef}
              className="absolute left-0 w-full"
              style={{
                transform: `translateY(${panelTop}px)`,
                transition: disableMoveAnim ? "none" : "transform 250ms ease",
                willChange: "transform",
              }}
            >
              {/* subMenu */}
              <div
                style={{
                  opacity: opening ? 0 : 1,
                  transform: opening
                    ? "translateY(-10px) scale(0.9)"
                    : "translateY(0px) scale(1)",
                  transition:
                    "opacity 380ms cubic-bezier(0.16, 1, 0.3, 1), transform 700ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "opacity, transform",
                }}
                className="mt-2 px-[18%] 2xl:px-[25%] wrap-normal"
              >
                {activeItem?.content}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="w-10/12">
        <Outlet />
      </main>
    </div>
  );
}
