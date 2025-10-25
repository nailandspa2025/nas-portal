/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { Card, Row, Col, Modal, Button } from "antd";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import queryString from "query-string";
import { toast } from "react-toastify";

// Calendar components
import CalendarMain from "../../components/calendar/CalendarMain";
import EventModal from "../../components/calendar/EventModal";
import FilterData from "../../components/common/FilterData";
import * as utils from "../../utils/filter/bookings";

// APIs and utils
import { BookingApi } from "../../apis/order/booking";
import { buildFormData } from "../../utils/common/buildFormData";

// Modals
import ModalConfirm from "../../components/ModalConfirm";
import ModalPayment from "../../components/ModalPayment";
import ModalCancelBooking from "../../components/ModalCancelBooking";
import { QRCodeCanvas } from "qrcode.react";
import "./calendar.scss";

// Helper function to parse booking date and time
const parseBookingDateTime = (bookingDate: string, bookingTime: string) => {
  if (!bookingDate || !bookingTime) {
    return dayjs(); // Fallback to current date/time if data is missing
  }

  // Extract date part from ISO string (remove time and Z)
  const datePart = bookingDate.split("T")[0]; // Gets "2025-10-02"
  const timeStr = bookingTime; // "10:20:00"

  // Combine date and time properly
  return dayjs(`${datePart}T${timeStr}`);
};

const Bookings = () => {
  const { t } = useTranslation();

  // Calendar states
  const [currentView, setCurrentView] = useState("resourceTimeGridDay");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs().add(1, "day"));

  // Filter states
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Modal states
  const [openEventModal, setOpenEventModal] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModalPayment, setOpenModalPayment] = useState(false);
  const [openModalCancel, setOpenModalCancel] = useState(false);
  const [openQrModal, setQrModal] = useState(false);
  const [paymentData, setPaymentData] = useState<any>({});
  const [approveUrl, setApproveUrl] = useState<any>(null);
  const [rowId, setRowId] = useState<number>(0);

  // Filter handler
  const handleFilterChange = (params: Record<string, string>) => {
    setFilters(params);
  };

  // Get bookings data
  const { data: bookingsData, refetch: refetchBookings } = useQuery({
    queryKey: [
      "bookingCalendarList",
      { startDate: currentDate, endDate: endDate, ...filters },
    ],
    queryFn: async () => {
      const response: any = await BookingApi.getWithPagination(
        queryString.stringify({
          pageNumber: 1,
          pageSize: 1000,
          fromDate: currentDate.format("YYYY-MM-DD"),
          endDate: endDate.format("YYYY-MM-DD"),
          ...filters,
        })
      );
      return response.data;
    },
  });

  // Transform technicians from booking data to resources
  const resources = useMemo(() => {
    if (!bookingsData?.items) return [];

    const techniciansMap = new Map<number, any>();

    bookingsData.items.forEach((booking: any) => {
      booking.technicians?.forEach((tech: any) => {
        if (!techniciansMap.has(tech.id)) {
          techniciansMap.set(tech.id, {
            id: tech.id.toString(),
            title: tech.technicianName || `Staff ${tech.id}`,
            technicianName: tech.technicianName,
            phone: tech.phone,
            address: tech.technicianAddress,
          });
        }
      });
    });

    const techResources = Array.from(techniciansMap.values());

    const unassigned = {
      id: "unassigned",
      title: "Unassigned",
      technicianName: "Unassigned",
    };

    return [unassigned, ...techResources];
  }, [bookingsData?.items]);

  // ✅ Event mapping
  const events = useMemo(() => {
    if (!bookingsData?.items) return [];

    const statusColorMap: Record<number, string> = {
      1: "#faad14", // Pending
      2: "#52c41a", // Completed
      3: "#ff4d4f", // Cancelled
    };

    const allEvents: any[] = [];

    bookingsData.items.forEach((booking: any) => {
      const status = booking.status || 1;
      const color = statusColorMap[status] || "#1677ff";

      const startDateTime = parseBookingDateTime(
        booking.bookingDate,
        booking.bookingTime
      );

      const timeDisplay = booking.bookingTime
        ? dayjs(booking.bookingTime, "HH:mm:ss").format("HH:mm")
        : "";

      const technicianIds =
        booking.technicianIds && booking.technicianIds.length > 0
          ? booking.technicianIds
          : ["unassigned"];

      // ✅ Nhân event ra cho mỗi technician
      technicianIds.forEach((techId: any, index: number) => {
        allEvents.push({
          id: `${booking.id}_${techId}`, // unique id
          title: booking.fullName || `Booking #${booking.id}`,
          start: startDateTime.toDate(),
          resourceId: techId.toString(), // gán 1 technician duy nhất
          backgroundColor: color,
          borderColor: color,
          textColor: "#ffffff",
          extendedProps: {
            ...booking,
            technicianIds: booking.technicianIds,
            originalId: booking.id,
            technicianIndex: index + 1,
            totalTechnicians: technicianIds.length,
            startTime: timeDisplay,
            status,
            statusColor: color,
            serviceIds: booking.serviceIds,
            productName:
              booking.services?.length > 0
                ? booking.services.map((s: any) => s.name).join(", ")
                : "",
          },
        });
      });
    });

    return allEvents;
  }, [bookingsData]);

  // Event handlers
  const handleDateClick = (arg: any) => {
    setEventData({
      bookingDate: dayjs(arg.dateStr),
      fullName: "",
      phone: "",
      email: "",
    });
    setOpenEventModal(true);
  };

  const handleEventClick = (arg: any) => {
    const booking = arg.event.extendedProps;
    setEventData({
      ...booking,
      bookingDate: dayjs(booking.bookingDate),
      bookingTime: dayjs(booking.bookingTime, "HH:mm:ss"),
      originalId: booking.originalId,
    });
    setOpenEventModal(true);
  };

  const handleCreateEvent = () => {
    setEventData({
      fullName: "",
      phone: "",
      email: "",
      bookingDate: dayjs(),
    });
    setOpenEventModal(true);
  };

  // Mutations
  const createBookingMutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return BookingApi.create(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Create booking successfully!"));
        refetchBookings();
        setOpenEventModal(false);
        setEventData(null);
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error: any) => {
      toast.error(t(error.message));
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return BookingApi.update(values.id, formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Update booking successfully!"));
        refetchBookings();
        setOpenEventModal(false);
        setEventData(null);
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error: any) => {
      toast.error(t(error.message));
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (id: number) => {
      return BookingApi.delete(id);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Delete booking successfully!"));
        refetchBookings();
        setOpenEventModal(false);
        setEventData(null);
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error: any) => {
      toast.error(t(error.message));
    },
  });

  const cancelBookingMutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return BookingApi.cancel(rowId, formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        toast.success(t("Cancel booking successfully!"));
        refetchBookings();
        setOpenModalCancel(false);
        setRowId(0);
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error: any) => {
      toast.error(t(error.message));
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async (values: any) => {
      const formD = new FormData();
      buildFormData(formD, values);
      return BookingApi.payment(formD);
    },
    onSuccess: (res: any) => {
      if (res.succeeded) {
        const approveUrl = res.data?.approveUrl;
        if (approveUrl) {
          setApproveUrl(approveUrl);
          setQrModal(true);
        }
        toast.success(t("Payment processed successfully!"));
        refetchBookings();
        setOpenModalPayment(false);
      } else {
        toast.error(t(res.message));
      }
    },
    onError: (error: any) => {
      toast.error(t(error.message));
    },
  });

  // Event handlers
  const handleEventSubmit = (values: any) => {
    const payload = {
      ...values,
      bookingDate: dayjs(values.bookingDate).format("YYYY-MM-DD"),
      bookingTime: dayjs(values.bookingTime).format("HH:mm:ss"),
    };

    if (eventData?.originalId) {
      payload.id = eventData.originalId;
      updateBookingMutation.mutate(payload);
    } else {
      createBookingMutation.mutate(payload);
    }
  };

  const handleEventDelete = (booking: any) => {
    setRowId(booking.originalId);
    setOpenModal(true);
  };

  const handleEventPayment = (booking: any) => {
    setPaymentData(booking);
    setOpenModalPayment(true);
    setOpenEventModal(false);
  };

  const handleConfirmDelete = () => {
    deleteBookingMutation.mutate(rowId);
    setOpenModal(false);
  };

  const handlePaymentSubmit = async (values: any) => {
    const payload = {
      ...values,
      returnUrl: window.location.origin + "/payment/success",
      cancelUrl: window.location.origin + "/payment/failed",
    };
    paymentMutation.mutate(payload);
  };

  const handleCancelSubmit = (values: any) => {
    const payload = {
      ...values,
      id: rowId,
    };
    cancelBookingMutation.mutate(payload);
  };

  // Custom utils for calendar - only filters, no columns/buttons
  const calendarUtils = useMemo(() => {
    return {
      filters: utils.filters || [], // Keep filters
    };
  }, []);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row style={{ marginBottom: "16px" }}>
              <FilterData
                onFilterChange={handleFilterChange}
                utils={calendarUtils}
                filteredColumns={[]}
                onColumnChange={() => {}}
              />
            </Row>
            <CalendarMain
              events={events}
              resources={resources}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              currentView={currentView}
              setCurrentView={setCurrentView}
              setCurrentDate={setCurrentDate}
              currentDate={currentDate}
              setEndDate={setEndDate}
              endDate={endDate}
              onCreate={handleCreateEvent}
            />
          </Card>
        </Col>
      </Row>

      {/* Event Modal */}
      <EventModal
        open={openEventModal}
        setOpen={setOpenEventModal}
        eventData={eventData}
        setEventData={setEventData}
        loading={
          createBookingMutation.isPending || updateBookingMutation.isPending
        }
        onSubmit={handleEventSubmit}
        handleDelete={handleEventDelete}
        handlePayment={handleEventPayment}
      />

      {/* Delete Confirmation Modal */}
      <ModalConfirm
        openModal={openModal}
        setOpenModal={setOpenModal}
        onChange={handleConfirmDelete}
      />

      {/* Payment Modal */}
      <ModalPayment
        data={paymentData}
        openModal={openModalPayment}
        setOpenModal={setOpenModalPayment}
        onSubmit={handlePaymentSubmit}
      />

      {/* Cancel Booking Modal */}
      <ModalCancelBooking
        openModal={openModalCancel}
        setOpenModal={setOpenModalCancel}
        onSubmit={handleCancelSubmit}
      />

      {/* QR Payment Modal */}
      <Modal
        title={<span className="font-semibold text-lg">💳 Scan QR to pay</span>}
        open={openQrModal}
        onCancel={() => setQrModal(false)}
        footer={[
          <Button
            key="cancel"
            type="primary"
            danger
            onClick={() => setQrModal(false)}
          >
            {t("Cancel")}
          </Button>,
        ]}
        centered
      >
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <QRCodeCanvas value={approveUrl || ""} size={220} />
          <p style={{ marginTop: 16, fontSize: 14, color: "#555" }}>
            Use your banking app or e-wallet to scan the code
          </p>
          <a
            href={approveUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginTop: 12,
              color: "#1677ff",
            }}
          >
            👉 Open payment link
          </a>
        </div>
      </Modal>
    </div>
  );
};
export default Bookings;
