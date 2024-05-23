export type NemoOrder = {
    method: string
    apiVersion: string
    params: {
      type: string
      id: number
    }
    data: {
      system: string
      orderType: string
      id: number
      lastModifiedDate: string
      currentServerDate: string
      customer: {
        userId: number
        agencyId: number
        companyId: number
        backofficeCompanyId: any
        name: string
        phone: string
        email: string
      }
      passengers: {
        ID_PAS_1: {
          lastName: string
          firstName: string
          middleName: any
          gender: string
          birthDate: string
          nationality: string
          docType: string
          docNumber: string
          docExpiryDate: string
          phone: string
          email: string
        }
      }
      products: {
        ID_FLT_1: {
          info: {
            nemo: {
              flightId: number
              searchId: number
              packageId: number
              status: string
              utmSource: string
              utmMarker: any
            }
            nemoConnect: {
              system: string
              id: number
              packageId: number
              status: string
              subStatus: any
              possibleActions: Array<string>
            }
            supplier: {
              system: string
              id: string
              environment: string
              bookingAgencyId: string
              ticketingAgencyId: string
              ticketingIATAValidator: any
            }
          }
          dates: {
            creation: string
            booking: string
            ticketing: any
            void: any
            cancellation: any
            timelimit: {
              price: string
              ticketing: string
              advancedPurchase: any
              effective: string
            }
          }
          segments: {
            ID_SEG_1: {
              index: number
              leg: number
              departure: {
                date: string
                airport: string
                terminal: string
                country: string
              }
              arrival: {
                date: string
                airport: string
                terminal: string
                country: string
              }
              UTC: {
                warning: string
                departure: string
                arrival: string
              }
              marketingAirline: string
              flightNumber: string
              operatingAirline: string
              eticket: boolean
              RBD: string
              service: string
              status: string
              supplierRef: any
            }
            ID_SEG_2: {
              index: number
              leg: number
              departure: {
                date: string
                airport: string
                terminal: string
                country: string
              }
              arrival: {
                date: string
                airport: string
                terminal: string
                country: string
              }
              UTC: {
                warning: string
                departure: string
                arrival: string
              }
              marketingAirline: string
              flightNumber: string
              operatingAirline: string
              eticket: boolean
              RBD: string
              service: string
              status: string
              supplierRef: any
            }
          }
          pricingInfo: {
            ID_PCG_1: {
              validatingCarrier: string
              tourCode: any
              commission: {
                amount: string
                currency: string
              }
              commissionForSubagency: {
                amount: string
                currency: string
              }
              passengerFare: {
                ID_PSF_1: {
                  pricingType: string
                  passCount: number
                  baseFare: {
                    amount: string
                    currency: string
                  }
                  equiveFare: {
                    amount: string
                    currency: string
                  }
                  totalFare: {
                    amount: string
                    currency: string
                  }
                  passengers: Array<string>
                  fareBasis: Array<{
                    code: string
                    type: string
                    segments: Array<string>
                    baggage: {
                      value: number
                      measurement: string
                    }
                  }>
                }
              }
              ID_PCG_2: {
                validatingCarrier: string
                tourCode: any
                commission: {
                  amount: string
                  currency: string
                }
                commissionForSubagency: {
                  amount: string
                  currency: string
                }
                passengerFare: {
                  ID_PSF_1: {
                    pricingType: string
                    passCount: number
                    baseFare: {
                      amount: string
                      currency: string
                    }
                    equiveFare: {
                      amount: string
                      currency: string
                    }
                    totalFare: {
                      amount: string
                      currency: string
                    }
                    passengers: Array<string>
                    fareBasis: Array<{
                      code: string
                      type: string
                      segments: Array<string>
                      baggage: {
                        value: number
                        measurement: string
                      }
                    }>
                    taxes: Array<{
                      code?: string
                      tax?: {
                        amount: string
                        currency: string
                      }
                      type?: string
                      price?: {
                        amount: string
                        currency: string
                      }
                      paid?: Array<{
                        type: string
                        price: {
                          amount: string
                          currency: string
                        }
                      }>
                    }>
                  }
                }
              }
              remarks: Array<{
                type: string
                text: string
              }>
            }
            ID_EXT_1: {
              type: string
              products: Array<{
                price: {
                  amount: string
                  currency: string
                }
                basePrice: {
                  amount: string
                  currency: string
                }
                charge: {
                  amount: string
                  currency: string
                }
                status: string
                name: string
                rfisc: string
                rfic: string
                type: string
                passengers: Array<string>
                segments: Array<string>
              }>
            }
          }
          price: {
            amount: string
            currency: string
            components: {
              products: {
                amount: string
                currency: string
                components: {
                  ID_FLT_1: {
                    amount: string
                    currency: string
                  }
                  ID_EXT_1: {
                    amount: string
                    currency: string
                  }
                }
              }
              charges: {
                amount: string
                currency: string
                components: {
                  agencyProfit: {
                    amount: string
                    currency: string
                    components: {
                      pricingMarkup: {
                        amount: string
                        currency: string
                        components: {
                          ID_PCG_1: {
                            amount: string
                            currency: string
                          }
                          ID_PCG_2: {
                            amount: string
                            currency: string
                          }
                        }
                      }
                      fixingPriceMarkup: {
                        amount: string
                        currency: string
                      }
                      problemDiscount: {
                        amount: string
                        currency: string
                      }
                      subagentDiscount: {
                        amount: string
                        currency: string
                      }
                      promoDiscount: {
                        amount: string
                        currency: string
                        promocode: {
                          id: string
                          code: string
                          actionId: string
                          actionCode: string
                        }
                      }
                      roundingMarkup: {
                        amount: string
                        currency: string
                      }
                    }
                  }
                  subagencyProfit: {
                    amount: string
                    currency: string
                  }
                  gatewayProfit: {
                    amount: string
                    currency: string
                  }
                }
              }
            }
          }
          payments: Array<any>
          documents: Array<any>
          currencyRates: Array<any>
          linkedOrders: {
            splitted: Array<any>
            exchangedForOrder: any
            mainOrderId: any
            multiOrderEnvelope: any
            exchangeClaims: Array<any>
            returnClaims: Array<any>
          }
        }
      }
    }
  }
  