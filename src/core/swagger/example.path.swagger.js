const { exampleTag } = require('./example.tag.swagger.js')

module.exports = {
	'/example/{pathName}': {
		post: {
			//get, delete, put
			tags: [exampleTag.name],
			summary: 'test summary',
			description: 'test description',
			operationId: 'testOperationId',
			consumes: ['application/json'],
			produces: ['application/json'],
			parameters: [
				{
					in: 'body',
					description: 'body description',
					name: 'bodyName',
					schema: {
						type: 'object',
						properties: {
							email: {
								type: 'string',
								default: 'ahmed.derbala@esprit.tn',
								required: false,
								description: 'email description'
							},
							arrayOfString: {
								type: 'array',
								default: `["12345678","ahmed"]`,
								required: false,
								description: 'test description',
								items: {
									type: 'string'
								}
							},
							arrayOfObject: {
								type: 'array',
								required: false,
								description: 'test description',
								items: {
									type: 'object',
									properties: {
										email: {
											type: 'string',
											default: 'ahmed.derbala@esprit.tn',
											required: false,
											description: 'user email'
										},
										password: {
											type: 'string',
											default: '12345678',
											required: false
										}
									}
								},
								default: [
									{ id: 1, name: 'ahmed' },
									{ id: 2, name: 'mahdi' }
								]
							},
							arrayOfArrays: {
								type: 'array',
								required: false,
								description: 'test description',
								items: {
									type: 'array',
									items: {
										type: 'object',
										properties: {
											id: {
												type: 'integer',
												default: 'ahmed.derbala@esprit.tn',
												required: false,
												description: 'user id'
											},
											name: {
												type: 'string',
												default: '12345678',
												required: false,
												description: 'user name'
											}
										}
									}
								},
								default: [
									[
										{ id: 1, name: 'ahmed' },
										{ id: 2, name: 'mahdi' }
									],
									[
										{ id: 1, name: 'ali' },
										{ id: 2, name: 'salah' }
									]
								]
							}
						}
					}
				},
				{
					in: 'path',
					description: 'path description',
					name: 'pathName'
				},
				{
					in: 'query',
					description: 'query param 1',
					name: 'param1'
				},
				{
					in: 'query',
					description: 'query param 2',
					name: 'param2'
				}
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					}
				}
			},
			security: [{ bearerAuth: [] }], //components.securitySchemes and security are a must to send JWT
			responses: {
				200: {
					description: 'responses is a must to execute the request'
				},
				'resp-example': {
					description: 'example description',
					schema: {
						type: 'object',
						properties: {
							id: {
								type: 'integer',
								default: 'ahmed.derbala@esprit.tn',
								required: false,
								description: 'user id'
							},
							name: {
								type: 'string',
								default: '12345678',
								required: false,
								description: 'user name'
							}
						}
					}
				}
			} //responses is a must to execute the request
		}
	}
}
