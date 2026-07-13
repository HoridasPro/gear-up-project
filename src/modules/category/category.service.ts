// import { prisma } from "../../lib/prisma";

// const getAllCategoriesIntoDB = async () => {
//   const categoryResult = await prisma.gearItem.findMany({
//     distinct: ["category"],
//     select: {
//       category: true,
//     },
//     orderBy: {
//       category: "asc",
//     },
//   });
//   const categoriesFilter = categoryResult.map((item) => item.category);

//   return categoriesFilter;
// };

// export const categoryService = {
//   getAllCategoriesIntoDB,
// };
