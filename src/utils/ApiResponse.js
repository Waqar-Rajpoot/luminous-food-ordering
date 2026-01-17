class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400;
    }
}

export {ApiResponse}

// useage
return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd successfully"));