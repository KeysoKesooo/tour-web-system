import { Label } from "@/components/ui/Label";
import { BookingStatus, IBooking } from "@/types/IntBooking";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface BookingRowProps {
  booking: IBooking;
  onStatusChange: (id: string, status: BookingStatus) => void;
}

export const BookingRow = ({ booking, onStatusChange }: BookingRowProps) => {
  const [status, setStatus] = useState<BookingStatus>(booking.status);

  const handleChange = async (newStatus: BookingStatus) => {
    setStatus(newStatus);
    try {
      await onStatusChange(booking.id, newStatus);
      toast.success("Booking status updated");
    } catch (err) {
      toast.error("Failed to update status");
      setStatus(booking.status); // revert on error
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4">{booking.fullName}</td>
      <td className="px-6 py-4">{booking.email}</td>
      <td className="px-6 py-4">{booking.numPersons}</td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <Label htmlFor={`status-${booking.id}`} className="text-sm">
            Status
          </Label>
          <select
            id={`status-${booking.id}`}
            value={status}
            onChange={(e) => handleChange(e.target.value as BookingStatus)}
            className="mt-1 w-full border px-2 py-1 rounded"
          >
            {Object.values(BookingStatus).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </td>
    </tr>
  );
};
