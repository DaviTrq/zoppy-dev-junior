"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProdutoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_produto_dto_1 = require("./create-produto.dto");
class UpdateProdutoDto extends (0, swagger_1.PartialType)(create_produto_dto_1.CreateProdutoDto) {
}
exports.UpdateProdutoDto = UpdateProdutoDto;
//# sourceMappingURL=update-produto.dto.js.map