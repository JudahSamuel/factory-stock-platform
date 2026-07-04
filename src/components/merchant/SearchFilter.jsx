import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

export default function SearchFilter({

  search,

  setSearch,

  category,

  setCategory,

  categories,

}) {

  return (

    <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">

      <div className="flex flex-col md:flex-row gap-5">

        {/* Search */}

        <div className="relative flex-1">

          <FaSearch
            className="absolute left-4 top-4 text-gray-400"
          />

          <motion.input

            whileFocus={{
              scale: 1.02,
            }}

            transition={{
              duration: 0.2,
            }}

            value={search}

            onChange={(e)=>
              setSearch(e.target.value)
            }

            placeholder="Search products..."

            className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:border-blue-500"

          />

        </div>

        {/* Category */}

        <motion.select

          whileFocus={{
            scale:1.02
          }}

          value={category}

          onChange={(e)=>
            setCategory(e.target.value)
          }

          className="border rounded-xl px-5 py-3 min-w-[220px]"

        >

          {

            categories.map(cat=>(

              <option

                key={cat}

                value={cat}

              >

                {cat}

              </option>

            ))

          }

        </motion.select>

      </div>

    </div>

  );

}