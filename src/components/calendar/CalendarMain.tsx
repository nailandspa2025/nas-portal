/* eslint-disable @typescript-eslint/no-explicit-any */
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useState } from "react";
import { Button, Col, Row, Space, DatePicker } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import {
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
} from "@ant-design/icons";

interface CalendarMainProps {
  events: any[];
  onDateClick: (arg: any) => void;
  onEventClick: (arg: any) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  setCurrentDate: (date: dayjs.Dayjs) => void;
  currentDate: any;
  setEndDate: (date: dayjs.Dayjs) => void;
  endDate?: any;
  onCreate: () => void;
}

export default function CalendarMain({
  events,
  onDateClick,
  onEventClick,
  currentView,
  setCurrentView,
  setCurrentDate,
  currentDate,
  setEndDate,
  onCreate,
}: CalendarMainProps) {
  const { i18n, t } = useTranslation();

  const calendarRef = useRef<FullCalendar | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  const handleDateSelect = (date: dayjs.Dayjs | null) => {
    if (date) {
      const calendarApi = calendarRef.current?.getApi();
      calendarApi?.gotoDate(date.toDate());
      setCurrentDate(date);
    }
  };

  const changeView = (viewName: string) => {
    setCurrentView(viewName);
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(viewName);
  };
  return (
    <>
      <Row justify="space-between" align="middle" gutter={[8, 8]}>
        <Col flex="auto">
          <Space.Compact>
            <Button
              type={currentView == "dayGridMonth" ? "primary" : undefined}
              onClick={() => changeView("dayGridMonth")}>
              {t("Month")}
            </Button>
            <Button
              onClick={() => changeView("timeGridWeek")}
              type={currentView == "timeGridWeek" ? "primary" : undefined}>
              {t("Week")}
            </Button>
            <Button
              onClick={() => changeView("timeGridDay")}
              type={currentView === "timeGridDay" ? "primary" : undefined}>
              {t("Day")}
            </Button>
            <Button
              onClick={() => changeView("listWeek")}
              type={currentView == "listWeek" ? "primary" : undefined}>
              {t("Next to")}
            </Button>
            <Button onClick={() => onCreate()} icon={<PlusOutlined />}></Button>
          </Space.Compact>
        </Col>
        <Col flex="auto">
          <div style={{ fontSize: 18, fontWeight: 600, textAlign: "center" }}>
            {currentDate.add(1, "month").format("MMMM YYYY")}{" "}
          </div>
        </Col>
        <Col flex="auto">
          <div
            style={{
              textAlign: "end",
            }}>
            <Space.Compact>
              <Button onClick={handleToday}>{t("Today")}</Button>
              <Button icon={<LeftOutlined />} onClick={handlePrev} />
              <Button
                icon={<CalendarOutlined />}
                onClick={() => setDatePickerOpen(true)}
              />
              <Button icon={<RightOutlined />} onClick={handleNext} />
            </Space.Compact>
          </div>
          <DatePicker
            open={datePickerOpen}
            onOpenChange={setDatePickerOpen}
            onChange={handleDateSelect}
            value={currentDate}
            format="DD/MM/YYYY"
            style={{
              position: "absolute",
              visibility: "hidden",
              width: 0,
              height: 0,
              zIndex: 2,
            }}
          />
        </Col>
        <Col span={24}>
          <FullCalendar
            ref={calendarRef}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              listPlugin,
              interactionPlugin,
            ]}
            initialView={currentView}
            headerToolbar={false}
            events={events}
            dateClick={onDateClick}
            eventClick={onEventClick}
            height="auto"
            firstDay={1}
            locale={i18n.language}
            allDaySlot={false}
            slotMinTime="06:00:00"
            //slotDuration="01:00:00"
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            titleFormat={{ year: "numeric", month: "numeric" }}
            datesSet={(arg) => {
              setCurrentDate(dayjs(arg.start));
              setEndDate(dayjs(arg.end));
            }}
            // dayHeaderContent={(arg) => {
            //   const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
            //   const day = dayNames[arg.date.getDay()];
            //   const date = arg.date;
            //   const formatted = `${String(date.getDate()).padStart(
            //     2,
            //     "0"
            //   )}/${String(date.getMonth() + 1).padStart(2, "0")}`;
            //   return `${day} ${formatted}`;
            // }}
            dayHeaderClassNames={() => "custom-header-cell"}
            dayHeaderDidMount={(info) => {
              Object.assign(info.el.style, {
                backgroundColor: "#e4eeef",
                color: "#333",
                fontWeight: "600",
                padding: "10px 0",
                textAlign: "center",
                borderBottom: "1px solid #eee",
                fontSize: "14px",
              });
            }}
            eventContent={(arg) => {
              const { event } = arg;
              const startTime = event.extendedProps?.startTime || "00:00";
              return (
                <div>
                  <div>{startTime}</div>
                  <div>{event.title}</div>
                </div>
              );
            }}
          />
        </Col>
      </Row>
    </>
  );
}
