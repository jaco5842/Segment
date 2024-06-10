SELECT 
        'Invoiced Order' as event,
        header.[No_] as invoiceNo,
        CASE
            WHEN header.[Sell-to Customer No_] = 'PRIVAT' THEN NULL
            ELSE header.[Sell-to Customer No_]
        END AS bcid,
        header.[Posting Date] as timestamp,
        header.[Order No_] as OrderId,
        header.[Payment Method Code] as PaymentMethod,
        header.[Shipping Agent Code] as ShippingMethod,
        header.[Transport Method] as shipmentType,
        header.[Sell-to E-Mail] as email,
        header.[Gen_ Bus_ Posting Group],
        web.[Web Order ID] AS webOrderId,
        header.[Currency Code] as CurrencyCode,
        30 as areaId,
        'Excellent Wine' AS company,
        MAX(totalAmount.total) AS totalAmount
    FROM [PW-BC].[dbo].[Excellent Wine$Sales Invoice Header] AS header
    JOIN (
        SELECT [Document No_], SUM([Amount Including VAT]) AS total
        FROM [PW-BC].[dbo].[Excellent Wine$Sales Invoice Line]
        GROUP BY [Document No_]
    ) AS totalAmount
    ON totalAmount.[Document No_] = header.[No_]
    JOIN [PW-BC].[dbo].[Excellent Wine$Sales Invoice Header$19da28b2-7d51-49e6-8304-0f8b850a7da4] AS web
        ON web.[No_] = header.[No_]
    WHERE
        header.[Sell-to E-Mail] IS NOT NULL
        AND header.[Sell-to E-Mail] <> ''
        AND header.[Gen_ Bus_ Posting Group] IN ('PRIVAT', 'SEK-PRIVAT', 'Smallbiz')
        AND header.[Posting Date] >= @date
    GROUP BY
        header.[Payment Method Code],
        header.[Shipping Agent Code],
        header.[Order No_],
        header.[No_],
        header.[Sell-to Customer No_],
        header.[Posting Date],
        header.[Sell-to E-Mail],
        header.[Gen_ Bus_ Posting Group],
        header.[Currency Code],
        header.[Shipment Method Code],
        header.[Transport Method],
        web.[Web Order ID]