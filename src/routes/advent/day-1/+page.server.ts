import { fail, type Actions, type ServerLoad } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { formSchema } from "$lib/schema";

export const load: ServerLoad = async () => {
    return {
        form: await superValidate(formSchema)
    }
}

export const actions: Actions = {
    default: async (event) => {
        const form = await superValidate(event, formSchema)
        console.log(form)
        if (!form.valid) {
            return fail(400, {form})
        }
        return {form}
    }
}