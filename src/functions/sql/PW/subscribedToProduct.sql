SELECT 
            [CustomerNo] AS bcid,
            [Subscription Type Code] AS subscriptionName,
            [NextInvoiceDate] as nextSubscriptionDelivery,
            CASE 
                WHEN [Terminated] = 0 THEN 'subscribed'
                WHEN [Terminated] = 1 THEN 'unsubscribed'
                ELSE 'unknown'
            END as subscriptionStatus,
            [TerminatedDate] as subscriptionTerminationDate,
            [Created DateTime] as subscriptionCreatedDate,
            [Ship-to E-Mail] as email,
            [Web Order ID] as OrderId,
			CASE 
                WHEN [Terminated] = 0 THEN 'Subscription Created'
                WHEN [Terminated] = 1 THEN 'Subscription Terminated'
                ELSE 'unknown'
            END as event
            FROM [PW-BC].[dbo].[Philipson Wine$Subscription Header$b54cc016-db5a-4d0e-bd6f-7f2d2151637c]
            WHERE ([Created DateTime] >= '2024-06-09' OR [TerminatedDate] >= '2024-06-09')