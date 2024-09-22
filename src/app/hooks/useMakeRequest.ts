import { fetchData, FetchDataParams } from "@/utils/fetchData";
import { useEffect, useState } from "react";

export type MakeRequestParamsOptions = {
  page: number;
  searchTerm: string;
  token: string;
  showAlert: boolean;
} & FetchDataParams;

export type MakeRequestParams = {
  url: string;
  options: MakeRequestParamsOptions;
};

export const useMakeRequest =  <T>({
  url,
  options,
}: MakeRequestParams) => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<T | null>(null);

  const doRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const data = await fetchData({
          endpoint: `${url}?page=${options.page}&search=${options.searchTerm}`,
          token,
          showAlert: options.showAlert,
        });
        if (data) {
          setData(data.data.results);
        }
        setData(null);
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      doRequest();
    }, 300);

    return () => clearTimeout(id);
  }, [search]);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  }

  return {
    handleSearch,
    search,
    doRequest,
    data
  }
};
