import { Server, Socket } from "socket.io";
import db from "./config/knex-pg"; // Your knex instance

export const registerSockets = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected:", socket.id);

    // Ride request listener
    socket.on("request_ride", async (data) => {
      try {
        const { user_id, vehicle_id, pickup, destination } = data;
        const [ride] = await db("rides").insert({
          user_id,
          vehicle_id,
          pickup_location: pickup,
          destination_location: destination,
          status: "pending"
        }).returning("*");
        console.log("Ride requested:", ride);
        io.emit("new_ride", ride);
      } catch (err) {
        console.error("Error creating ride:", err);
        socket.emit("ride_error", { message: "Unable to create ride." });
      }
    });

    // Ride status update listener
    socket.on("update_ride_status", async (data) => {
      try {
        const { ride_id, status } = data;
        const [updatedRide] = await db("rides")
          .where({ id: ride_id })
          .update({ status })
          .returning("*");
        io.emit("ride_status_updated", updatedRide);
      } catch (err) {
        console.error("Error updating ride status:", err);
        socket.emit("ride_error", { message: "Unable to update ride." });
      }
    });

    // Payment confirmation listener
    socket.on("payment_done", async (data) => {
      try {
        const { ride_id, amount, user_id } = data;
        const [payment] = await db("payments").insert({
          ride_id,
          user_id,
          amount,
          status: "completed"
        }).returning("*");
        io.emit("payment_completed", payment);
      } catch (err) {
        console.error("Payment error:", err);
        socket.emit("payment_error", { message: "Payment could not be processed." });
      }
    });

    // Disconnect listener
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};
