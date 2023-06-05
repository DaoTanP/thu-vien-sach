export function convertToJavaScriptDate (value: string | null): string | null
{
    if (!value)
        return null;
    const pattern = /Date\(([^)]+)\)/;
    const results = pattern.exec(value) || [];
    var dt = new Date(parseFloat(results[1]));

    if (Number.isNaN(dt.getDate()))
        return null;

    return dt.toLocaleDateString();
    // return dt.getDate() + "/" + (dt.getMonth() + 1) + "/" + dt.getFullYear();
}