export default function asyncMiddleware(handler) {

    return async (req, res, next) => {
        try {
            await handler(req, res)
        } catch (error) {
            console.log("ERROR!".red);
            console.log(error)
            next(error)
        }
    }
}