import { Router } from "express";
import { Ticket_addData } from "../controllers/help_ticket_controller";
export class ticketRoute {
    static ticket(){
        const router=Router()

        router.route('/ticket/:id').post(Ticket_addData.add_data)
        router.route('/getData/:storeId').get(Ticket_addData.fetch_data)
        router.route('/delete/:id').delete(Ticket_addData.delete_data);
        router.route('/update/:id').post(Ticket_addData.update_data)

        return router
    }
}