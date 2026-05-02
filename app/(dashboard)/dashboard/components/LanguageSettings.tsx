// "use client";
//
// import * as React from "react";
// import { useTranslations } from "next-intl";
// import { toast } from "react-toastify";
//
// import { Spinner } from "@/components/Spinner";
// import { PageHeader } from "@/app/(dashboard)/dashboard/components/PageHeader";
//
// import {
//     useGetSettingsLanguageQuery,
//     useUpdateSettingsLanguageMutation,
// } from "@/services/api/settingsApi";
//
// import {
//     useGetSettingsVisibleLanguagesQuery,
// } from "@/services/api/settingsApi";
//
// import { Button } from "@/components/ui/button";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
//
// export function LanguageSettings() {
//     const t = useTranslations("Dashboard");
//
//     // -----------------------
//     // APIs
//     // -----------------------
//     const { data: currentLanguage, isLoading: isLoadingCurrent } =
//         useGetSettingsLanguageQuery();
//
//     const { data: languages = [], isLoading: isLoadingLanguages } =
//         useGetSettingsVisibleLanguagesQuery();
//
//     const [updateLanguage, { isLoading: isUpdating }] =
//         useUpdateSettingsLanguageMutation();
//
//     // -----------------------
//     // state
//     // -----------------------
//     const [selectedLanguageId, setSelectedLanguageId] =
//         React.useState<string>("");
//
//     // sync current value
//     React.useEffect(() => {
//         if (currentLanguage?.defaultLanguageId) {
//             setSelectedLanguageId(currentLanguage.defaultLanguageId);
//         }
//     }, [currentLanguage]);
//
//     // -----------------------
//     // update
//     // -----------------------
//     const handleUpdate = async (value?: string) => {
//         const langId = value ?? selectedLanguageId;
//         if (!langId) return;
//
//         try {
//             await updateLanguage({
//                 defaultLanguageId: langId,
//             }).unwrap();
//
//             toast.success(t("updateSuccess"));
//         } catch (err) {
//             toast.error(t("updateError"));
//         }
//     };
//
//     // auto update on change (optional)
//     const handleChange = (value: string) => {
//         setSelectedLanguageId(value);
//         handleUpdate(value);
//     };
//
//     // -----------------------
//     // loading
//     // -----------------------
//     if (isLoadingCurrent || isLoadingLanguages) {
//         return <Spinner />;
//     }
//
//     // -----------------------
//     // render
//     // -----------------------
//     return (
//         <div className="w-full space-y-6">
//             <PageHeader title={t("languageSettings")} />
//
//             <div className="flex flex-col gap-4 max-w-md">
//                 <Select
//                     value={selectedLanguageId}
//                     onValueChange={handleChange}
//                 >
//                     <SelectTrigger>
//                         <SelectValue placeholder={t("selectLanguage")} />
//                     </SelectTrigger>
//
//                     <SelectContent>
//                         {languages.map((lang) => (
//                             <SelectItem key={lang.id} value={lang.id}>
//                                 {lang.fullName}
//                             </SelectItem>
//                         ))}
//                     </SelectContent>
//                 </Select>
//
//                 {/* optional button (if you DON'T want auto save, keep it) */}
//                 <Button
//                     onClick={() => handleUpdate()}
//                     disabled={isUpdating || !selectedLanguageId}
//                 >
//                     {t("save")}
//                 </Button>
//             </div>
//         </div>
//     );
// }